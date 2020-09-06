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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {DeckListViewComponent} from './components/deck-list-view/deck-list-view.component';
import {HttpClientModule} from "@angular/common/http";
import {NewDeckModalComponent} from './components/new-deck-modal/new-deck-modal.component';
import {DeckListCardComponent} from './components/deck-list-card/deck-list-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DECK_ID_PARAM, DeckViewComponent} from './components/deck-view/deck-view.component';
import {DeckListPageComponent} from './components/deck-list-page/deck-list-page.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {NavBarItemsDirective} from './components/nav-bar-items.directive';
import {DeckListNavbarComponent} from './components/deck-list-navbar/deck-list-navbar.component';
import {DeckViewTableListElement} from './components/deck-view-table-list-element/deck-view-table-list-element.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {NewTableModalComponent} from './components/new-table-modal/new-table-modal.component';
import {TABLE_ID_PARAM, TableViewComponent} from './components/table-view/table-view.component';
import {TableColumnEditorComponent} from './components/table-column-editor/table-column-editor.component';
import {TableCellComponent} from './components/table-cell/table-cell.component';
import {TableNewRowEditorComponent} from './components/table-new-row-editor/table-new-row-editor.component';
import {TableCellEditorComponent} from './components/table-cell-editor/table-cell-editor.component';
import {TableColumnComponent} from './components/table-column/table-column.component';
import {ConfirmDeleteDeckModalComponent} from './components/confirm-delete-deck-modal/confirm-delete-deck-modal.component';
import {TableRowComponent} from './components/table-row/table-row.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ConfirmDeleteTableColumnModalComponent} from './components/confirm-delete-table-column-modal/confirm-delete-table-column-modal.component';
import {ConfirmDeleteTableModalComponent} from './components/confirm-delete-table-modal/confirm-delete-table-modal.component';
import {LearningViewComponent, TABLE_SESSION_ID_PARAM} from './components/learning-view/learning-view.component';
import {SetupTableSessionModalComponent} from './components/setup-table-session-modal/setup-table-session-modal.component';
import {TableSessionModeWizardComponent} from './components/table-session-mode-wizard/table-session-mode-wizard.component';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.11
 */
@NgModule({
	declarations: [
		AppComponent,
		DeckListViewComponent,
		NewDeckModalComponent,
		DeckListCardComponent,
		DeckViewComponent,
		DeckListPageComponent,
		TopBarComponent,
		NavBarItemsDirective,
		DeckListNavbarComponent,
		DeckViewTableListElement,
		SidebarComponent,
		NewTableModalComponent,
		TableViewComponent,
		TableColumnEditorComponent,
		TableCellComponent,
		TableNewRowEditorComponent,
		TableCellEditorComponent,
		TableColumnComponent,
		ConfirmDeleteDeckModalComponent,
		TableRowComponent,
		ConfirmDeleteTableColumnModalComponent,
		ConfirmDeleteTableModalComponent,
		LearningViewComponent,
		SetupTableSessionModalComponent,
		TableSessionModeWizardComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot([
			{path: '', redirectTo: '/decks', pathMatch: 'full'},
			{path: 'decks', component: DeckListPageComponent},
			{path: `decks/:${DECK_ID_PARAM}`, component: DeckViewComponent},
			{path: `tables/:${TABLE_ID_PARAM}/edit`, component: TableViewComponent},
			{path: `tables/:${TABLE_ID_PARAM}/learn/:${TABLE_SESSION_ID_PARAM}`, component: LearningViewComponent}
		]),
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
