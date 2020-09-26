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
	AfterContentInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {GraphElementService} from "../../services/graph-element.service";
import {GraphNode} from "../../models/GraphNode";
import {FormControl} from "@angular/forms";
import {Graph} from "../../models/Graph";
import {GraphNodeRepository} from "../../repositories/graph-node-repository.service";
import {GraphEdgeRepository} from "../../repositories/graph-edge-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.14
 */
@Component({
	selector: 'app-graph-label-editor',
	templateUrl: './graph-label-editor.component.html',
	styleUrls: ['./graph-label-editor.component.sass']
})
export class GraphLabelEditorComponent implements OnInit, AfterContentInit {

	@ViewChild('labelInputElement', {static: true})
	labelInputElement: ElementRef;

	@Input()
	graph: Graph;
	@Input()
	selectedNode: GraphNode;
	@Input()
	shouldAppend: boolean;

	@Output()
	editingAborted = new EventEmitter();

	labelInput = new FormControl('');

	constructor(
		private readonly nodeRepository: GraphNodeRepository,
		private readonly edgeRepository: GraphEdgeRepository,
		private readonly elementService: GraphElementService) {
	}

	ngOnInit(): void {
	}

	ngAfterContentInit(): void {
		setTimeout(() => {
			this.labelInputElement.nativeElement.focus();
			if (!this.shouldAppend) {
				this.labelInput.setValue(this.selectedNode?.value);
			}
		});
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.editingAborted.emit();
	}

	async submitValue() {
		if (!this.graph || !this.labelInput.value) {
			return;
		}
		const label = this.labelInput.value.trim();
		if (this.shouldAppend && this.selectedNode) {
			const newNode = await this.elementService.addNode(this.graph, label);
			await this.elementService.addEdge(this.graph, this.selectedNode, newNode);
		} else if (this.selectedNode) {
			this.selectedNode.value = label;
			await this.nodeRepository.update(this.selectedNode);
		} else {
			await this.elementService.addNode(this.graph, label);
		}
	}
}
