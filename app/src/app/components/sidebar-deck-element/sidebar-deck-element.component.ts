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

import {Directive, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ConfirmDeleteElementModalComponent} from "../confirm-delete-element-modal/confirm-delete-element-modal.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Directive({
	selector: 'li [sidebar-deck-element]',
})
export abstract class SidebarDeckElementComponent implements OnInit {

	@ViewChild(ConfirmDeleteElementModalComponent)
	confirmDeleteModal: ConfirmDeleteElementModalComponent;

	@Input()
	element: SidebarDeckElement;

	editMode: boolean = false;
	nameInput = new FormControl('');
	elementCount: string | number;

	protected constructor() {
	}

	async ngOnInit() {
		this.nameInput.setValue(this.element?.name);
	}

	async onDelete(): Promise<void> {
		await this.onDeleteHandler(this.element.id);
	}

	onEditClicked(): void {
		this.editMode = true;
	}

	async onChangesSubmit() {
		if (this.element === null) {
			return;
		}
		this.element.name = this.nameInput.value;

		await this.onUpdateHandler(this.element);
		this.editMode = false;
	}

	async onNameClick() {
		await this.onClickHandler(this.element.id);
	}

	confirmDeletion() {
		this.confirmDeleteModal.openModal();
	}

	protected abstract onClickHandler(id: string): Promise<void>;

	protected abstract onDeleteHandler(id: string): Promise<void>;

	protected abstract onUpdateHandler(element: SidebarDeckElement): Promise<void>;
}

export interface SidebarDeckElement {
	id: string,
	name: string,
}