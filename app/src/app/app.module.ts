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
import {SidebarTableListElementComponent} from './components/sidebar-deck-element/sidebar-table-list-element.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {NewDeckElementModalComponent} from './components/new-deck-element-modal/new-deck-element-modal.component';
import {TABLE_ID_PARAM, TableViewComponent} from './components/table-view/table-view.component';
import {TableColumnEditorComponent} from './components/table-column-editor/table-column-editor.component';
import {TableCellComponent} from './components/table-cell/table-cell.component';
import {TableNewRowEditorComponent} from './components/table-new-row-editor/table-new-row-editor.component';
import {TableCellEditorComponent} from './components/table-cell-editor/table-cell-editor.component';
import {TableColumnComponent} from './components/table-column/table-column.component';
import {TableRowComponent} from './components/table-row/table-row.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ConfirmDeleteTableColumnModalComponent} from './components/confirm-delete-table-column-modal/confirm-delete-table-column-modal.component';
import {ConfirmDeleteElementModalComponent} from './components/confirm-delete-element-modal/confirm-delete-element-modal.component';
import {SessionViewComponent, TABLE_SESSION_MODE_ID_PARAM} from './components/session-view/session-view.component';
import {SessionSetupModalComponent} from './components/session-setup-modal/session-setup-modal.component';
import {TableSessionModeWizardComponent} from './components/table-session-mode-wizard/table-session-mode-wizard.component';
import {SessionAnswerEditorComponent} from './components/session-answer-editor/session-answer-editor.component';
import {SessionNavigationComponent} from './components/session-navigation/session-navigation.component';
import {SessionCompletionViewComponent} from './components/session-completion-view/session-completion-view.component';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {SidebarGraphListElementComponent} from './components/sidebar-deck-element/sidebar-graph-list-element.component';
import {GRAPH_ID_PARAM, GraphViewComponent} from './components/graph-view/graph-view.component';
import {GraphToolbarComponent} from './components/graph-toolbar/graph-toolbar.component';
import {GraphLabelEditorComponent} from './components/graph-label-editor/graph-label-editor.component';
import {SessionAnswerViewComponent} from './components/session-answer-view/session-answer-view.component';
import {NotFoundViewComponent} from './components/not-found-view/not-found-view.component';
import {SessionQuestionViewComponent} from './components/session-question-view/session-question-view.component';
import {SessionModeChooserComponent} from './components/session-mode-chooser/session-mode-chooser.component';
import {SessionScoreSettingsComponent} from './components/session-score-settings/session-score-settings.component';
import {AlternativeAnswerEditorComponent} from './components/alternative-answer-editor/alternative-answer-editor.component';
import {SidebarFlashcardSetListElementComponent} from "./components/sidebar-deck-element/sidebar-flashcard-set-list-element.component";
import {
	FLASHCARD_SET_ID_PARAM,
	FlashcardSetViewComponent
} from './components/flashcard-set-view/flashcard-set-view.component';
import {FlashcardEditorComponent} from './components/flashcard-editor/flashcard-editor.component';

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
		SidebarTableListElementComponent,
		SidebarComponent,
		NewDeckElementModalComponent,
		TableViewComponent,
		TableColumnEditorComponent,
		TableCellComponent,
		TableNewRowEditorComponent,
		TableCellEditorComponent,
		TableColumnComponent,
		TableRowComponent,
		ConfirmDeleteTableColumnModalComponent,
		ConfirmDeleteElementModalComponent,
		SessionViewComponent,
		SessionSetupModalComponent,
		TableSessionModeWizardComponent,
		SessionAnswerEditorComponent,
		SessionNavigationComponent,
		SessionCompletionViewComponent,
		LoginModalComponent,
		SidebarGraphListElementComponent,
		SidebarTableListElementComponent,
		SidebarFlashcardSetListElementComponent,
		GraphViewComponent,
		GraphToolbarComponent,
		GraphLabelEditorComponent,
		SessionAnswerViewComponent,
		NotFoundViewComponent,
		SessionQuestionViewComponent,
		SessionModeChooserComponent,
		SessionScoreSettingsComponent,
		AlternativeAnswerEditorComponent,
		FlashcardSetViewComponent,
		FlashcardEditorComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot([
			{path: '', redirectTo: '/decks', pathMatch: 'full'},
			{path: 'decks', component: DeckListPageComponent},
			{path: `decks/:${DECK_ID_PARAM}`, component: DeckViewComponent},
			{path: `tables/:${TABLE_ID_PARAM}/edit`, component: TableViewComponent},
			{path: `tables/:${TABLE_ID_PARAM}/learn/:${TABLE_SESSION_MODE_ID_PARAM}`, component: SessionViewComponent},
			{path: `graphs/:${GRAPH_ID_PARAM}/edit`, component: GraphViewComponent},
			{path: `graphs/:${GRAPH_ID_PARAM}/learn`, component: SessionViewComponent},
			{path: `flashcards/:${FLASHCARD_SET_ID_PARAM}/edit`, component: FlashcardSetViewComponent},
			{path: `flashcards/:${FLASHCARD_SET_ID_PARAM}/learn`, component: SessionViewComponent},
			{path: '**', component: NotFoundViewComponent},
		], { useHash: true, relativeLinkResolution: 'legacy' }),
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
