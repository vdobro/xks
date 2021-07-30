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

import {Table} from "@app/models/Table";
import {TableSessionMode} from "@app/models/TableSessionMode";

import {TableSessionModeService} from "@app/services/table-session-mode.service";
import {TableElementService} from "@app/services/table-element.service";

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
				private readonly tableElementService: TableElementService) {
		sessionModeService.$modesChanged.subscribe(async _ => {
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
		let id = this.modeSelectElement?.nativeElement?.value || this.table?.defaultSessionModeId;
		if (!id && this.table?.sessionModes?.length) {
			id = this.table.sessionModes[0].id;
		}
		const table = this.table;
		if (id && table) {
			this.currentSelection = this.mapModeToOption(this.sessionModeService.getById(id, table), table);
		}
		this.configurationChanged.emit();
	}

	private async loadSessionModes(): Promise<void> {
		const table = this.table;
		if (table) {
			const modes = table.sessionModes;
			this.sessionModes = modes.map(mode => this.mapModeToOption(mode, table));
		} else {
			this.sessionModes = [];
		}
	}

	private mapModeToOption(mode: TableSessionMode, table: Table): ModeOption {
		const questionColumns = this.getColumnNames(mode.questionColumnIds, table);
		const answerColumns = this.getColumnNames(mode.answerColumnIds, table);
		const separator = ', ';
		return {
			id: mode.id,
			name: `(${questionColumns.join(separator)}) ⟼ (${answerColumns.join(separator)})`,
		}
	}

	private getColumnNames(columnIds: string[], table: Table): string[] {
		return columnIds
			.map(id => this.tableElementService.findColumn(id, table))
			.map(column => column.name);
	}
}

export interface ModeOption {
	id: string,
	name: string,
}
