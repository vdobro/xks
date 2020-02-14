/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "GraphEditorView.h"

xks::view::GraphEditorView::GraphEditorView(const RefPtr<Builder>& builder) : GraphEditorView() {
	builder->get_widget("graphList", graph_list);
}

ListBox& xks::view::GraphEditorView::get_graph_list() const {
	return *graph_list;
}