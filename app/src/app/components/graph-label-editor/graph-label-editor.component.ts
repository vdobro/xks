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

import {GraphNode} from "@app/models/GraphNode";
import {Graph} from "@app/models/Graph";
import {GraphEdge} from "@app/models/GraphEdge";

import {GraphElementService} from "@app/services/graph-element.service";

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
	graph: Graph | null = null;
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
				this.edgeLabelInput.setValue(this.selectedEdge?.name);
			} else if (this.nodeLabelInputElement) {
				this.nodeLabelInputElement.nativeElement.focus();
			}
			if (this.nodeLabelInputElement && !this.shouldAppend) {
				const value = this.selectedNode?.value || '';
				this.nodeLabelInput.setValue(value);
			}
		});
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.editingAborted.emit();
	}

	async submitValue() {
		if (!this.graph || (!this.nodeLabelInput.value && !this.edgeLabelInput.value)) {
			return;
		}

		if (this.shouldAppend && this.selectedNode) {
			await this.appendNewNode();
		} else if (this.selectedNode || this.selectedEdge) {
			if (this.selectedEdge) {
				await this.renameEdge();
			}
			if (this.selectedNode) {
				await this.renameNode();
			}
		} else {
			await this.createNode();
		}
		this.editingAborted.emit();
	}

	private async appendNewNode() {
		const nodeLabel = this.nodeLabelInput.value.trim();
		const edgeLabel = this.edgeLabelInput.value?.trim();
		if (!nodeLabel || !this.graph || !this.selectedNode) {
			return;
		}
		const newNode = await this.elementService.addNode(nodeLabel, this.graph);
		await this.elementService.addEdge(this.graph, this.selectedNode, newNode, edgeLabel);
	}

	private async renameEdge() {
		if (!this.selectedEdge || !this.graph) {
			return;
		}
		this.selectedEdge.name = this.edgeLabelInput.value.trim();
		await this.elementService.updateEdge(this.selectedEdge, this.graph);
	}

	private async renameNode() {
		const newLabel = this.nodeLabelInput.value.trim();
		if (!newLabel || !this.selectedNode || !this.graph) {
			return;
		}
		this.selectedNode.value.default = newLabel;
		await this.elementService.updateNode(this.selectedNode, this.graph);
	}

	private async createNode() {
		const nodeLabel = this.nodeLabelInput.value.trim();
		if (!nodeLabel || !this.graph) {
			return;
		}
		await this.elementService.addNode(nodeLabel, this.graph);
	}
}
