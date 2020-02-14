/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "TableEditorView.h"

xks::view::TableEditorView::TableEditorView(const RefPtr<Builder>& builder) : TableEditorView() {
	builder->get_widget("tableEditorToolbar", table_editor_toolbar);
	builder->get_widget("addColumnButton", add_column_button);
	builder->get_widget("tableEditor", table_editor_view);
	builder->get_widget("tableList", table_list);
}

Toolbar& xks::view::TableEditorView::get_table_editor_toolbar() const {
	return *table_editor_toolbar;
}

ToolButton& xks::view::TableEditorView::get_add_column_button() const {
	return *add_column_button;
}

TreeView& xks::view::TableEditorView::get_table_editor_view() const {
	return *table_editor_view;
}

ListBox& xks::view::TableEditorView::get_table_list() const {
	return *table_list;
}
