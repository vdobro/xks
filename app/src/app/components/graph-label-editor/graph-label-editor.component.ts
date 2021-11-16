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
import {FormControl} from "@angular/forms";

import {GraphNode} from "@app/models/graph-node";
import {GraphEdge} from "@app/models/graph-edge";

import {GraphElementService} from "@app/services/graph-element.service";
import {ElementId} from "@app/models/element-id";

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

	@ViewChild('edgeLabelInputElement')
	edgeLabelInputElement: ElementRef | undefined;
	@ViewChild('nodeLabelInputElement')
	nodeLabelInputElement: ElementRef | undefined;

	@Input()
	graphId: ElementId | null = null;

	@Input()
	selectedNode: GraphNode | null = null;
	@Input()
	selectedEdge: GraphEdge | null = null;
	@Input()
	shouldAppend: boolean = false;

	@Output()
	editingAborted = new EventEmitter();

	nodeLabelInput = new FormControl('');
	edgeLabelInput = new FormControl('');

	constructor(private readonly elementService: GraphElementService) {
	}

	ngOnInit(): void {
	}

	ngAfterContentInit(): void {
		setTimeout(async () => {
			if (this.edgeLabelInputElement) {
				this.edgeLabelInputElement.nativeElement.focus();
				this.edgeLabelInput.setValue(this.selectedEdge?.value?.default);
			} else if (this.nodeLabelInputElement) {
				this.nodeLabelInputElement.nativeElement.focus();
			}
			if (this.nodeLabelInputElement && !this.shouldAppend) {
				const value = this.selectedNode?.value?.default || '';
				this.nodeLabelInput.setValue(value);
			}
		});
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.editingAborted.emit();
	}

	async submitValue() {
		if (!this.graphId) {
			return;
		}

		if (this.shouldAppend && this.selectedNode) {
			await this.appendNewNode();
		} else if (this.selectedEdge) {
			await this.renameEdge();
		} else if (this.selectedNode) {
			await this.renameNode();
		} else {
			await this.createNode();
		}
		this.editingAborted.emit();
	}

	private async appendNewNode() {
		const nodeLabel = this.nodeLabelInput.value.trim();
		const edgeLabel = this.edgeLabelInput.value?.trim();
		if (!nodeLabel || !this.graphId || !this.selectedNode) {
			return;
		}
		const newNode = await this.elementService.addNodeToGraph(this.graphId, nodeLabel);
		await this.elementService.addEdgeToGraph(this.graphId, this.selectedNode, newNode, edgeLabel);
	}

	private async renameEdge() {
		if (!this.selectedEdge || !this.graphId) {
			return;
		}
		const label = this.edgeLabelInput.value.trim();
		await this.elementService.updateEdge(label, this.selectedEdge.id, this.graphId);
	}

	private async renameNode() {
		if (!this.selectedNode || !this.graphId) {
			return;
		}
		const newLabel = this.nodeLabelInput.value.trim();
		await this.elementService.updateNode(newLabel, this.selectedNode.id, this.graphId);
	}

	private async createNode() {
		const nodeLabel = this.nodeLabelInput.value.trim();
		if (!nodeLabel || !this.graphId) {
			return;
		}
		await this.elementService.addNodeToGraph(this.graphId, nodeLabel);
	}
}
