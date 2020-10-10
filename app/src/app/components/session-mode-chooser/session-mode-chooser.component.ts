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

import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {Table} from "../../models/Table";
import {TableSessionMode} from "../../models/TableSessionMode";
import {TableColumnRepository} from "../../repositories/table-column-repository.service";
import {TableSessionModeRepository} from "../../repositories/table-session-mode-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.08
 */
@Component({
	selector: 'app-session-mode-chooser',
	templateUrl: './session-mode-chooser.component.html',
	styleUrls: ['./session-mode-chooser.component.sass']
})
export class SessionModeChooserComponent implements OnInit, OnChanges {

	@ViewChild("modeSelect")
	modeSelectElement: ElementRef | undefined;

	@Input()
	table: Table | null = null;

	@Output()
	configurationChanged = new EventEmitter<void>();

	currentSelection: ModeOption | null = null;
	sessionModes: ModeOption[] = [];

	constructor(private readonly sessionModeService: TableSessionModeService,
				private readonly columnRepository: TableColumnRepository,
				sessionModeRepository: TableSessionModeRepository) {

		sessionModeRepository.entityDeleted.subscribe(async _ => {
			await this.loadSessionModes();
		});
	}

	async ngOnInit(): Promise<void> {
		await this.changeSelection();
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		this.currentSelection = null;
		await this.loadSessionModes();
		await this.changeSelection();
	}

	async changeSelection() {
		const id = this.modeSelectElement?.nativeElement?.value || this.table?.defaultSessionModeId;
		if (id) {
			this.currentSelection = await this.mapModeToOption(await this.sessionModeService.getById(id));
		}
		this.configurationChanged.emit();
	}

	private async loadSessionModes() : Promise<void> {
		if (this.table) {
			const modes = await this.sessionModeService.getAllIn(this.table);
			this.sessionModes = await Promise.all(modes.map(mode => this.mapModeToOption(mode)));
		} else {
			this.sessionModes = [];
		}
	}

	private async mapModeToOption(mode: TableSessionMode) : Promise<ModeOption> {
		const questionColumns = await this.getColumnNames(mode.questionColumnIds);
		const answerColumns = await this.getColumnNames(mode.answerColumnIds);
		const separator = ', ';
		return {
			id: mode.id,
			name: `(${questionColumns.join(separator)}) ⟼ (${answerColumns.join(separator)})`,
		}
	}

	private async getColumnNames(columnIds: string[]) : Promise<string[]> {
		return (await Promise.all(columnIds.map(id => this.columnRepository.getById(id))))
			.map(column => column.name);
	}
}

export interface ModeOption {
	id: string,
	name: string,
}
