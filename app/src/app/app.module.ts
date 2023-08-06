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
import {RouterModule} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";

import {AppComponent} from '@app/app.component';
import {DeckListViewComponent} from '@app/components/deck-list-view/deck-list-view.component';
import {NewDeckModalComponent} from '@app/components/new-deck-modal/new-deck-modal.component';
import {DeckListCardComponent} from '@app/components/deck-list-card/deck-list-card.component';
import {DECK_ID_PARAM, DeckViewComponent} from '@app/components/deck-view/deck-view.component';
import {DeckListPageComponent} from '@app/components/deck-list-page/deck-list-page.component';
import {TopBarComponent} from '@app/components/top-bar/top-bar.component';
import {NavBarItemsDirective} from '@app/components/nav-bar-items.directive';
import {DeckListNavbarComponent} from '@app/components/deck-list-navbar/deck-list-navbar.component';
import {SidebarTableListElementComponent} from '@app/components/sidebar-deck-element/sidebar-table-list-element.component';
import {SidebarComponent} from '@app/components/sidebar/sidebar.component';
import {NewDeckElementModalComponent} from '@app/components/new-deck-element-modal/new-deck-element-modal.component';
import {TABLE_ID_PARAM, TableViewComponent} from '@app/components/table-view/table-view.component';
import {TableColumnEditorComponent} from '@app/components/table-column-editor/table-column-editor.component';
import {TableCellComponent} from '@app/components/table-cell/table-cell.component';
import {TableNewRowEditorComponent} from '@app/components/table-new-row-editor/table-new-row-editor.component';
import {TableCellEditorComponent} from '@app/components/table-cell-editor/table-cell-editor.component';
import {TableColumnComponent} from '@app/components/table-column/table-column.component';
import {TableRowComponent} from '@app/components/table-row/table-row.component';
import {ConfirmDeleteTableColumnModalComponent} from '@app/components/confirm-delete-table-column-modal/confirm-delete-table-column-modal.component';
import {ConfirmDeleteElementModalComponent} from '@app/components/confirm-delete-element-modal/confirm-delete-element-modal.component';
import {SessionViewComponent, TABLE_SESSION_MODE_ID_PARAM} from '@app/components/session-view/session-view.component';
import {SessionSetupModalComponent} from '@app/components/session-setup-modal/session-setup-modal.component';
import {TableSessionModeWizardComponent} from '@app/components/table-session-mode-wizard/table-session-mode-wizard.component';
import {SessionAnswerEditorComponent} from '@app/components/session-answer-editor/session-answer-editor.component';
import {SessionNavigationComponent} from '@app/components/session-navigation/session-navigation.component';
import {SessionCompletionViewComponent} from '@app/components/session-completion-view/session-completion-view.component';
import {LoginModalComponent} from '@app/components/login-modal/login-modal.component';
import {SidebarGraphListElementComponent} from '@app/components/sidebar-deck-element/sidebar-graph-list-element.component';
import {GRAPH_ID_PARAM, GraphViewComponent} from '@app/components/graph-view/graph-view.component';
import {GraphToolbarComponent} from '@app/components/graph-toolbar/graph-toolbar.component';
import {GraphLabelEditorComponent} from '@app/components/graph-label-editor/graph-label-editor.component';
import {SessionAnswerViewComponent} from '@app/components/session-answer-view/session-answer-view.component';
import {NotFoundViewComponent} from '@app/components/not-found-view/not-found-view.component';
import {SessionQuestionViewComponent} from '@app/components/session-question-view/session-question-view.component';
import {SessionModeChooserComponent} from '@app/components/session-mode-chooser/session-mode-chooser.component';
import {SessionScoreSettingsComponent} from '@app/components/session-score-settings/session-score-settings.component';
import {AlternativeAnswerEditorComponent} from '@app/components/alternative-answer-editor/alternative-answer-editor.component';
import {SidebarFlashcardSetListElementComponent} from "@app/components/sidebar-deck-element/sidebar-flashcard-set-list-element.component";
import {FLASHCARD_SET_ID_PARAM, FlashcardSetViewComponent} from '@app/components/flashcard-set-view/flashcard-set-view.component';
import {FlashcardEditorComponent} from '@app/components/flashcard-editor/flashcard-editor.component';
import {ElementTitleComponent} from '@app/components/element-title/element-title.component';

const DECK_ROUTE = `decks/:${DECK_ID_PARAM}`;
const TABLE_ROUTE = `${DECK_ROUTE}/tables/:${TABLE_ID_PARAM}`;
const GRAPH_ROUTE = `${DECK_ROUTE}/graphs/:${GRAPH_ID_PARAM}`;
const FLASHCARD_ROUTE = `${DECK_ROUTE}/cards/:${FLASHCARD_SET_ID_PARAM}`;

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
		ElementTitleComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot([
			{path: '', redirectTo: '/decks', pathMatch: 'full'},
			{path: 'decks', component: DeckListPageComponent},
			{path: DECK_ROUTE, component: DeckViewComponent},
			{path: `${TABLE_ROUTE}/edit`, component: TableViewComponent},
			{path: `${TABLE_ROUTE}/learn/:${TABLE_SESSION_MODE_ID_PARAM}`, component: SessionViewComponent},
			{path: `${GRAPH_ROUTE}/edit`, component: GraphViewComponent},
			{path: `${GRAPH_ROUTE}/learn`, component: SessionViewComponent},
			{path: `${FLASHCARD_ROUTE}/edit`, component: FlashcardSetViewComponent},
			{path: `${FLASHCARD_ROUTE}/learn`, component: SessionViewComponent},
			{path: '**', component: NotFoundViewComponent},
		], {useHash: true}),
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
		NgOptimizedImage,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
