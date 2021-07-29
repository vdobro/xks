/*
 * Copyright (C) 2021 Vitalijus Dobrovolskis
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

import {Subscribable, Unsubscribable} from "rxjs";
import {IdEntity} from "@app/repositories/id-entity";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.07.29
 */
export interface EntityChangeSource<TEntity extends IdEntity> {
	entityCreated: Subscribable<TEntity>;
	entityDeleted: Subscribable<string>;
	entityUpdated: Subscribable<TEntity>;
}

export interface EntityChangeSubscription<TEntity extends IdEntity> {
	entityCreated : Unsubscribable;
	entityDeleted: Unsubscribable;
	entityUpdated: Unsubscribable;
}
