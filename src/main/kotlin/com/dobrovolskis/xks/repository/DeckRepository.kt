package com.dobrovolskis.xks.repository

import com.dobrovolskis.xks.model.Deck
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import java.util.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@RepositoryRestResource(collectionResourceRel = "decks", path = "decks")
interface DeckRepository : PagingAndSortingRepository<Deck, UUID>