package com.dobrovolskis.xks.config

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */

const val ID_COLUMN_NAME = "id"
private const val TABLE_NAME_PREFIX = "xks_"

const val TABLE_DECKS = "${TABLE_NAME_PREFIX}deck"
const val TABLE_ITEM_TABLES = "${TABLE_NAME_PREFIX}table"
const val TABLE_TABLE_COLUMNS = "${TABLE_NAME_PREFIX}table_column"
const val TABLE_TABLE_ROWS = "${TABLE_NAME_PREFIX}table_row"
const val TABLE_TABLE_ROWS_COLUMNS = "${TABLE_NAME_PREFIX}table_row_column"
const val TABLE_TABLE_CELLS = "${TABLE_NAME_PREFIX}table_cell"