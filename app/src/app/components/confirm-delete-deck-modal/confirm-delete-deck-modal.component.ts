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
import {Deck} from "../../models/Deck";


/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.07
 */
@Component({
	selector: 'app-confirm-delete-deck-modal',
	templateUrl: './confirm-delete-deck-modal.component.html',
	styleUrls: ['./confirm-delete-deck-modal.component.sass']
})
export class ConfirmDeleteDeckModalComponent implements OnInit {

	@ViewChild("confirmDeleteDeckModal")
	modal: ElementRef;

	@Input()
	deck: Deck;

	@Output()
	confirmed = new EventEmitter<void>();

	constructor() {
	}

	ngOnInit(): void {
	}

	openDialog() {
		UIkit.modal(this.modal.nativeElement).show();
	}
}
