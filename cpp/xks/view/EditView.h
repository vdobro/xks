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

	class EditView {
	public:
		explicit EditView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		Paned& get_edit_stack() const;

		[[nodiscard]]
		Stack& get_item_edit_mode_stack() const;

		[[nodiscard]]
		Notebook& get_element_category_tabs() const;

		[[nodiscard]]
		Viewport& get_graph_tab() const;

		[[nodiscard]]
		Viewport& get_table_tab() const;

	private:
		EditView() = default;

		Paned* edit_stack;
		Stack* item_edit_mode_stack;

		Notebook* element_category_tabs;
		Viewport* graph_tab;
		Viewport* table_tab;
	};
}


