package com.dobrovolskis.xks.model

import com.dobrovolskis.xks.config.ID_COLUMN_NAME
import com.dobrovolskis.xks.config.TABLE_TABLE_CELLS
import org.springframework.lang.NonNull
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@Entity
@Table(name = TABLE_TABLE_CELLS)
data class TableCell(
        @NonNull @Column(name = "value")
        var value: String,

        @Id @Column(name = ID_COLUMN_NAME, updatable = false)
        var id: UUID? = null
)