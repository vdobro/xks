/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 25.01.2020
 */

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {

	class DeckListView {
	public:
		explicit DeckListView(const RefPtr<Gtk::Builder>& builder);

		[[nodiscard]]
		ListBox& get_deck_list() const;

	private:
		DeckListView() = default;

		ListBox* deck_list{};
	};
}