package com.dobrovolskis.xks.model

import com.dobrovolskis.xks.config.ID_COLUMN_NAME
import com.dobrovolskis.xks.config.TABLE_DECKS
import org.springframework.lang.NonNull
import java.util.*
import javax.persistence.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@Entity
@Table(name = TABLE_DECKS)
data class Deck(
        @NonNull @Column(name = COLUMN_NAME)
        var name: String,

        @NonNull @Column(name = COLUMN_DESCRIPTION)
        var description: String,

        @OneToMany(targetEntity = ItemTable::class,
                fetch = FetchType.LAZY,
                mappedBy = FIELD_DECK,
                orphanRemoval = true,
                cascade = [CascadeType.ALL])
        var lists: List<ItemTable> = emptyList(),

        @Id @GeneratedValue @Column(name = ID_COLUMN_NAME, updatable = false)
        var id: UUID? = null
)

private const val COLUMN_NAME = "name"
private const val COLUMN_DESCRIPTION = "description"

private const val FIELD_DECK = "deck"