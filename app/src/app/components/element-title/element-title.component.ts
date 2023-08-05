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

import {Component, Input} from '@angular/core';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.11.16
 */
@Component({
	selector: 'app-element-title',
	templateUrl: './element-title.component.html',
	styleUrls: ['./element-title.component.sass'],
	host: {'class': 'uk-width-expand'},
})
export class ElementTitleComponent {

	@Input()
	name: string = '';

}
