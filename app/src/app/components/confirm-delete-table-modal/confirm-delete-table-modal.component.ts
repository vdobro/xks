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

import UIkit from 'uikit';

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from "../../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.10
 */
@Component({
	selector: 'app-confirm-delete-table-modal',
	templateUrl: './confirm-delete-table-modal.component.html',
	styleUrls: ['./confirm-delete-table-modal.component.sass']
})
export class ConfirmDeleteTableModalComponent implements OnInit {

	@ViewChild('confirmDeleteTableModal')
	modal: ElementRef;

	@Input()
	table: Table;

	@Output()
	confirmed = new EventEmitter<void>();

	constructor() {
	}

	ngOnInit(): void {
	}

	openModal() {
		UIkit.modal(this.modal.nativeElement).show();
	}
}