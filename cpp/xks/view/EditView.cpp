/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "EditView.h"

xks::view::EditView::EditView(const RefPtr<Builder>& builder) : EditView() {
	builder->get_widget("editStack", edit_stack);
	builder->get_widget("itemEditModeStack", item_edit_mode_stack);

	builder->get_widget("elementCategoryTabs", element_category_tabs);
	builder->get_widget("graphTab", graph_tab);
	builder->get_widget("tableTab", table_tab);
}

Paned& xks::view::EditView::get_edit_stack() const {
	return *edit_stack;
}

Stack& xks::view::EditView::get_item_edit_mode_stack() const {
	return *item_edit_mode_stack;
}

Notebook& xks::view::EditView::get_element_category_tabs() const {
	return *element_category_tabs;
}

Viewport& xks::view::EditView::get_graph_tab() const {
	return *graph_tab;
}

Viewport& xks::view::EditView::get_table_tab() const {
	return *table_tab;
}