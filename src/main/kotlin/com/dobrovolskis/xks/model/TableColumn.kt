package com.dobrovolskis.xks.model

import com.dobrovolskis.xks.config.ID_COLUMN_NAME
import com.dobrovolskis.xks.config.TABLE_TABLE_COLUMNS
import org.springframework.lang.NonNull
import java.util.*
import javax.persistence.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@Entity
@Table(name = TABLE_TABLE_COLUMNS)
data class TableColumn (
        @NonNull @Column(name = COLUMN_NAME)
        var name: String,

        @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = COLUMN_TABLE_ID, updatable = false)
        var table: ItemTable,

        @Id @GeneratedValue @Column(name = ID_COLUMN_NAME, updatable = false)
        var id: UUID? = null
)

private const val COLUMN_NAME = "name"
private const val COLUMN_TABLE_ID = "table_id"