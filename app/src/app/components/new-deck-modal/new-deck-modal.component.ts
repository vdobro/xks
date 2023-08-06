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

import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {DeckService} from "@app/services/deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Component({
	selector: 'app-new-deck-modal',
	templateUrl: './new-deck-modal.component.html',
	styleUrls: ['./new-deck-modal.component.sass']
})
export class NewDeckModalComponent implements AfterViewInit {

	@ViewChild("newDeckModal")
	modal: ElementRef | undefined;

	@ViewChild("deckNameInput", {static: true})
	nameInputElement: ElementRef | undefined;

	submitDisabled : boolean = false;

	nameInput: FormControl<string> = new FormControl('', { nonNullable: true });
	descriptionInput: FormControl<string> = new FormControl('', { nonNullable: true });

	constructor(private readonly deckService: DeckService) {
	}

	async onSaveClick(): Promise<void> {
		this.submitDisabled = true;
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		const description = this.descriptionInput.value?.trim();
		await this.deckService.create(name, description ? description : '');

		this.clearForm();
		UIkit.modal(this.modal!.nativeElement).hide();
	}

	private clearForm(): void {
		this.nameInput.reset();
		this.descriptionInput.reset();
	}

	public openModal(): void {
		if (!this.modal) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();
		this.submitDisabled = false;
		this.nameInput.setValue('');
	}

	public ngAfterViewInit(): void {
		// @ts-ignore
		UIkit.util.on(this.modal.nativeElement, 'shown', _ => {
			this.nameInputElement?.nativeElement.focus()
		});
	}
}
