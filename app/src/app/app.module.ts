import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {DeckListViewComponent} from './components/deck-list-view/deck-list-view.component';
import {HttpClientModule} from "@angular/common/http";
import {DeckDetailsComponent} from './components/deck-details/deck-details.component';
import {DeckListCardComponent} from './components/deck-list-card/deck-list-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
	declarations: [
		AppComponent,
		DeckListViewComponent,
		DeckDetailsComponent,
		DeckListCardComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
