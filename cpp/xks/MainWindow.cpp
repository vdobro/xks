/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "MainWindow.h"

xks::MainWindow::MainWindow(const RefPtr<Gtk::Builder>& builder) :
		builder(builder),
		deck_list_view(make_shared<DeckListView>(DeckListView(builder))),
		edit_view(make_shared<EditView>(EditView(builder))),
		graph_editor_view(make_shared<GraphEditorView>(builder)),
		main_view(make_shared<MainView>(MainView(builder))),
		new_item_dialog_view(make_shared<NewItemDialogView>(NewItemDialogView(builder))),
		session_view(make_shared<SessionView>(SessionView(builder))),
		table_editor_view(make_shared<TableEditorView>(TableEditorView(builder))),
		gtk_window(get_window()) {}

Gtk::Window* xks::MainWindow::get_window() const {
	Window* windowPtr = nullptr;
	builder->get_widget(WINDOW_ID, windowPtr);
	return windowPtr;
}