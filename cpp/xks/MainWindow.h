//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>
#include <iostream>

#include "types.h"
#include "MainOrchestrator.h"
#include "view/DeckListView.h"
#include "view/EditView.h"
#include "view/GraphEditorView.h"
#include "view/MainView.h"
#include "view/NewItemDialogView.h"
#include "view/SessionView.h"
#include "view/TableEditorView.h"

using namespace Gtk;
using namespace Glib;

using namespace xks::view;


namespace xks {
	class MainWindow {
	public:
		explicit MainWindow(const RefPtr<Gtk::Builder>& builder) :
				builder(builder),
				deck_list_view(make_shared<DeckListView>(DeckListView(builder))),
				edit_view(make_shared<EditView>(EditView(builder))),
				graph_editor_view(make_shared<GraphEditorView>(builder)),
				main_view(make_shared<MainView>(MainView(builder))),
				new_item_dialog_view(make_shared<NewItemDialogView>(NewItemDialogView(builder))),
				session_view(make_shared<SessionView>(SessionView(builder))),
				table_editor_view(make_shared<TableEditorView>(TableEditorView(builder))),
				gtk_window(get_window()) {}

		[[nodiscard]]
		Gtk::Window* get_window() const {
			Window* windowPtr = nullptr;
			builder->get_widget(WINDOW_ID, windowPtr);
			return windowPtr;
		}

		[[nodiscard]]
		auto get_injector() const {
			return di::make_injector(
					di::bind<DeckListView>().to(deck_list_view),
					di::bind<EditView>().to(edit_view),
					di::bind<GraphEditorView>().to(graph_editor_view),
					di::bind<MainView>().to(main_view),
					di::bind<NewItemDialogView>().to(new_item_dialog_view),
					di::bind<SessionView>().to(session_view),
					di::bind<TableEditorView>().to(table_editor_view)
			);
		}

	private:
		inline static const string WINDOW_ID = "mainWindow";

		const RefPtr<Builder> builder;

		const sptr<DeckListView> deck_list_view;
		const sptr<EditView> edit_view;
		const sptr<GraphEditorView> graph_editor_view;
		const sptr<MainView> main_view;
		const sptr<NewItemDialogView> new_item_dialog_view;
		const sptr<SessionView> session_view;
		const sptr<TableEditorView> table_editor_view;

		Gtk::Window* const gtk_window{};
	};
}


