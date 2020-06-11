package com.dobrovolskis.xks.model

import com.dobrovolskis.xks.config.ID_COLUMN_NAME
import com.dobrovolskis.xks.config.TABLE_TABLE_ROWS
import com.dobrovolskis.xks.config.TABLE_TABLE_ROWS_COLUMNS
import java.util.*
import javax.persistence.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@Entity
@Table(name = TABLE_TABLE_ROWS)
data class TableRow (

        @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = COLUMN_TABLE_ID, updatable = false)
        var table: ItemTable,

        @OneToMany(cascade = [CascadeType.ALL])
        @JoinTable(name = TABLE_TABLE_ROWS_COLUMNS,
                joinColumns = [JoinColumn(name = "row_id", referencedColumnName = "id")],
                inverseJoinColumns = [JoinColumn(name = "cell_id", referencedColumnName = "id")]
        )
        @MapKeyJoinColumn(name = "column_id")
        var rowCells: Map<TableColumn, TableCell>,

        @Id @Column(name = ID_COLUMN_NAME, updatable = false)
        var id: UUID? = null
)

private const val COLUMN_TABLE_ID = "table_id"