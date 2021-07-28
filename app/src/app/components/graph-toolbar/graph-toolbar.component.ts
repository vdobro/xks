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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {Graph} from "@app/models/Graph";
import {GraphNode} from "@app/models/GraphNode";
import {GraphElementService} from "@app/services/graph-element.service";
import {GraphEdge} from "@app/models/GraphEdge";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.14
 */
@Component({
	selector: 'app-graph-toolbar',
	templateUrl: './graph-toolbar.component.html',
	styleUrls: ['./graph-toolbar.component.sass']
})
export class GraphToolbarComponent implements OnInit {

	@ViewChild('graphEditorTutorialModal', {static: true})
	tutorialModal: ElementRef | undefined;

	@Input()
	graph: Graph | null = null;

	@Input()
	selectedNode: GraphNode | null = null;
	@Input()
	selectedEdge: GraphEdge | null = null;

	connectNewNode: boolean = false;
	showToolbar: boolean = true;

	@Output()
	currentlyInEdit = new EventEmitter<boolean>();

	constructor(private readonly elementService: GraphElementService) {

		//TODO: close when entities change
	}

	ngOnInit(): void {
	}

	async deleteSelectedElement() {
		if (!this.graph) {
			return;
		}

		if (this.selectedNode) {
			await this.elementService.removeNode(this.selectedNode, this.graph);
		} else if (this.selectedEdge) {
			await this.elementService.removeEdge(this.selectedEdge, this.graph);
		}
	}

	appendNewNode() {
		this.connectNewNode = true;
		this.openEditor();
	}

	openEditor() {
		this.showToolbar = false;
		this.currentlyInEdit.emit(true);
	}

	closeEditor() {
		this.connectNewNode = false;
		this.showToolbar = true;
		this.currentlyInEdit.emit(false);
	}
}
