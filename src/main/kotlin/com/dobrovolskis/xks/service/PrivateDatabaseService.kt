/*
 * Copyright (C) 2020 Vitalijus Dobrovolskis
 *
 * This file is part of xks.
 *
 * xks is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * xks is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with xks; see the file LICENSE. If not,
 * see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package com.dobrovolskis.xks.service

import com.cloudant.client.api.CloudantClient
import com.cloudant.client.api.Database
import com.cloudant.client.org.lightcouch.NoDocumentException
import com.dobrovolskis.xks.config.PersistenceConfiguration
import com.dobrovolskis.xks.model.MemberConfiguration
import com.dobrovolskis.xks.model.UserDbSecurityConfiguration
import com.dobrovolskis.xks.web.CredentialsError
import org.springframework.stereotype.Service
import java.util.*
import java.util.UUID.randomUUID

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class PrivateDatabaseService(
	private val dbConfig: PersistenceConfiguration,
	private val client: CloudantClient
) {

	fun createDeckDatabase(
		username: String,
		deckId: UUID
	): String {
		val id = randomUUID().toString().replace("-", "")
		val deckDatabaseName = prefixDeckDatabaseName(id)
		Thread.sleep(200) //TODO: Deck owners should be separately kept up to date, PouchDB + CouchDB are not fast enough
		verifyAccessToDeck(username, deckId)

		val db = assertDatabaseNotCreated(deckDatabaseName)

		createTypeIndex(db)
		grantPermissionsToUse(username, db)
		addDeckDatabase(username, deckId, deckDatabaseName)
		return deckDatabaseName
	}

	fun removeAll(username: String) {
		val db = getPrivateDatabase(username)

		//TODO filter docs to be only of type "deck"
		val response = db.allDocsRequestBuilder.build().response
		for (doc in response.getDocsAs(DeckInfo::class.java)) {
			//TODO: check if any other user also has access to the deck
			val deckDb = doc.database

			db.remove(doc)
			removeByName(deckDb)
		}
		db.ensureFullCommit()
	}

	fun removeDeckDatabase(ownerUsername: String, id: UUID, ownerToken: String) {
		val deck = verifyAccessToDeck(ownerUsername, id)
		require(deck.ownerToken == ownerToken) {
			"Incorrect deck owner token"
		}
		removeByName(deck.database)
	}

	fun removeByName(databaseName: String) {
		client.deleteDB(databaseName)
	}

	fun createTypeIndex(username: String) {
		val db = getPrivateDatabase(username)
		Thread.sleep(200) // couch_per_user is too slow

		createTypeIndex(db)
	}

	fun createTypeIndex(db: Database) {
		db.createIndex("""{ "index": { "fields": ["type"] }, "name": "type-index", "type": "json" }""")
	}

	fun getPrivateDatabaseName(username: String): String {
		return "userdb-" + username.toByteArray()
			.joinToString(separator = "") { eachByte -> "%02x".format(eachByte) }
	}

	private fun getPrivateDatabase(username: String, forceCreate: Boolean = false): Database {
		val name = getPrivateDatabaseName(username)
		return client.database(name, forceCreate)
	}

	private fun verifyAccessToDeck(username: String, id: UUID): DeckInfo {
		val db = getPrivateDatabase(username)
		try {
			return db.find(DeckInfo::class.java, prefixDeckId(id))
		} catch (e: NoDocumentException) {
			throw IllegalArgumentException("No access to deck")
		}
	}

	private fun prefixDeckDatabaseName(id: String) = "xks_deck_${id}"

	private fun addDeckDatabase(
		username: String,
		deckId: UUID,
		deckDb: String
	) {
		val db = getPrivateDatabase(username)
		db.ensureFullCommit()
		val deck = db.find(DeckInfo::class.java, prefixDeckId(deckId))
		db.update(deck.copy(database = deckDb))
		db.ensureFullCommit()
	}

	private fun grantPermissionsToUse(
		username: String,
		db: Database
	) {
		db.save(
			UserDbSecurityConfiguration(
				admins = MemberConfiguration(names = listOf(dbConfig.username)),
				members = MemberConfiguration(names = listOf(username))
			)
		)
	}

	private fun assertDatabaseNotCreated(deckDatabaseName: String): Database {
		val db = client.database(deckDatabaseName, true)
		db.ensureFullCommit()
		try {
			val permissions = db.permissions
			require(permissions.isEmpty())
			throw CredentialsError()
		} catch (e: Throwable) {
			//OK, permissions not yet created
		}
		return db
	}

	private fun prefixDeckId(id: UUID) : String {
		return "xks-$id"
	}
}

const val DOC_TYPE_DECK = "deck"

data class DeckInfo(
	val _rev: String? = null,
	val _id: String,
	val type: String = DOC_TYPE_DECK,

	val name: String,
	val description: String,
	val database: String,
	val ownerToken: String,
)
