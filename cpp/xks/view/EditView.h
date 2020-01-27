//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class EditView {
	public:
		explicit EditView(const RefPtr<Builder>& builder) : EditView() {
			builder->get_widget("editStack", edit_stack);
			builder->get_widget("itemEditModeStack", item_edit_mode_stack);

			builder->get_widget("elementCategoryTabs", element_category_tabs);
			builder->get_widget("graphTab", graph_tab);
			builder->get_widget("tableTab", table_tab);
		}

		[[nodiscard]]
		Paned& get_edit_stack() const {
			return *edit_stack;
		}

		[[nodiscard]]
		Stack& et_item_edit_mode_stack() const {
			return *item_edit_mode_stack;
		}

		[[nodiscard]]
		Notebook& get_element_category_tabs() const {
			return *element_category_tabs;
		}

		[[nodiscard]]
		Viewport& get_graph_tab() const {
			return *graph_tab;
		}

		[[nodiscard]]
		Viewport& get_table_tab() const {
			return *table_tab;
		}

	private:
		EditView() = default;

		Paned* edit_stack;
		Stack* item_edit_mode_stack;

		Notebook* element_category_tabs;
		Viewport* graph_tab;
		Viewport* table_tab;
	};
}


