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

	class NewItemDialogView {
	public:
		explicit NewItemDialogView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		Popover& get_new_item_popover() const;

		[[nodiscard]]
		Label& get_name_label() const;

		[[nodiscard]]
		Entry& get_new_item_title_entry() const;

	private:
		NewItemDialogView() = default;

		Popover* new_item_popover;
		Label* name_label;
		Entry* new_item_title_entry;
	};
}


