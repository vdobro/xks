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

	class TableEditorView {
	public:
		explicit TableEditorView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		Toolbar& get_table_editor_toolbar() const;

		[[nodiscard]]
		ToolButton& get_add_column_button() const;

		[[nodiscard]]
		TreeView& get_table_editor_view() const;

		[[nodiscard]]
		ListBox& get_table_list() const;

	private:
		TableEditorView() = default;

		Toolbar* table_editor_toolbar;
		ToolButton* add_column_button;
		TreeView* table_editor_view;
		ListBox* table_list;
	};
}

