package com.dobrovolskis.xks.repository

import com.dobrovolskis.xks.model.ItemTable
import org.springframework.data.repository.CrudRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import java.util.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@RepositoryRestResource(collectionResourceRel = "lists", path = "lists")
interface ItemListRepository : CrudRepository<ItemTable, UUID>