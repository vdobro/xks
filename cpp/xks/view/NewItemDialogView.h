//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class NewItemDialogView {
	public:
		explicit NewItemDialogView(const RefPtr<Builder>& builder) : NewItemDialogView() {
			builder->get_widget("newElementPopover", new_item_popover);
			builder->get_widget("nameLabel", name_label);
			builder->get_widget("newElementTitleEntry", new_item_title_entry);
		}

	private:
		NewItemDialogView() = default;

		Popover* new_item_popover;
		Label* name_label;
		Entry* new_item_title_entry;
	};
}


