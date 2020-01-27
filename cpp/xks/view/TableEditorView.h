//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class TableEditorView {
	public:
		explicit TableEditorView(const RefPtr<Builder>& builder) : TableEditorView() {
			builder->get_widget("tableEditorToolbar", table_editor_toolbar);
			builder->get_widget("addColumnButton", add_column_button);
			builder->get_widget("tableEditor", table_editor_view);
			builder->get_widget("tableList", table_list);
		}

		[[nodiscard]]
		Toolbar& get_table_editor_toolbar() const {
			return *table_editor_toolbar;
		}

		[[nodiscard]]
		ToolButton& get_add_column_button() const {
			return *add_column_button;
		}

		[[nodiscard]]
		TreeView& get_table_editor_view() const {
			return *table_editor_view;
		}

		[[nodiscard]]
		ListBox& get_table_list() const {
			return *table_list;
		};

	private:
		TableEditorView() = default;

		Toolbar* table_editor_toolbar;
		ToolButton* add_column_button;
		TreeView* table_editor_view;
		ListBox* table_list;
	};
}

