import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {DeckListViewComponent} from './components/deck-list-view/deck-list-view.component';
import {HttpClientModule} from "@angular/common/http";
import {NewDeckModalComponent} from './components/new-deck-modal/new-deck-modal.component';
import {DeckListCardComponent} from './components/deck-list-card/deck-list-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeckViewComponent, DECK_ID_PARAM} from './components/deck-view/deck-view.component';
import {DeckListPageComponent} from './components/deck-list-page/deck-list-page.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import { NavBarItemsDirective } from './components/nav-bar-items.directive';
import { DeckListNavbarComponent } from './components/deck-list-navbar/deck-list-navbar.component';

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
