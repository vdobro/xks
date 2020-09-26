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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Graph} from "../../models/Graph";
import {GraphNode} from "../../models/GraphNode";
import {GraphElementService} from "../../services/graph-element.service";
import {GraphNodeRepository} from "../../repositories/graph-node-repository.service";

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

	@ViewChild('graphEditorTutorialModal', { static: true })
	tutorialModal: ElementRef;

	@Input()
	graph: Graph;

	@Input()
	selectedNode: GraphNode;

	connectNewNode: boolean = false;
	showToolbar: boolean = true;

	constructor(private readonly nodeRepository: GraphNodeRepository,
				private readonly elementService: GraphElementService) {

		this.nodeRepository.entityCreated.subscribe(_ => this.closeEditor());
		this.nodeRepository.entityUpdated.subscribe(_ => this.closeEditor());
	}

	ngOnInit(): void {
	}

	async deleteNode() {
		await this.elementService.removeNode(this.selectedNode);
	}

	appendNewNode() {
		this.connectNewNode = true;
		this.openEditor();
	}

	openEditor() {
		this.showToolbar = false;
	}

	closeEditor() {
		this.connectNewNode = false;
		this.showToolbar = true;
	}

	openTutorial() {

	}
}
