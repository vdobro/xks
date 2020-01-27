//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class DeckListView {
	public:
		explicit DeckListView(const RefPtr<Gtk::Builder>& builder) {
			builder->get_widget("deckList", deck_list);
		}

		[[nodiscard]]
		const ListBox& get_deck_list() const {
			return *deck_list;
		}

	private:
		DeckListView() = default;

		ListBox* deck_list;
	};
}