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
import {TableViewComponent} from './components/table-view/table-view.component';
import {TableCellEditorComponent} from './components/table-cell-editor/table-cell-editor.component';

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
		TableCellEditorComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot([
			{path: '', redirectTo: '/decks', pathMatch: 'full'},
			{path: 'decks', component: DeckListPageComponent},
			{path: `decks/:${DECK_ID_PARAM}`, component: DeckViewComponent},
		]),
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
