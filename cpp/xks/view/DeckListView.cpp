/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "DeckListView.h"

#include <gtkmm.h>

xks::view::DeckListView::DeckListView(const RefPtr<Gtk::Builder>& builder) {
	builder->get_widget("deckList", deck_list);
}

ListBox& xks::view::DeckListView::get_deck_list() const {
	return *(this->deck_list);
}

