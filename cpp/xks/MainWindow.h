//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>
#include <iostream>

#include "types.h"
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
using std::make_shared;

namespace xks {
	class MainWindow {
	public:
		explicit MainWindow(const string& filename) :
				builder(get_builder()),
				deck_list_view(make_shared<DeckListView>(DeckListView(builder))),
				edit_view(make_shared<EditView>(EditView(builder))),
				graph_editor_view(make_shared<GraphEditorView>(builder)),
				main_view(make_shared<MainView>(MainView(builder))),
				new_item_dialog_view(make_shared<NewItemDialogView>(NewItemDialogView(builder))),
				session_view(make_shared<SessionView>(SessionView(builder))),
				table_editor_view(make_shared<TableEditorView>(TableEditorView(builder))) {}

		const sptr<const DeckListView> deck_list_view;
		const sptr<const EditView> edit_view;
		const sptr<const GraphEditorView> graph_editor_view;
		const sptr<const MainView> main_view;
		const sptr<const NewItemDialogView> new_item_dialog_view;
		const sptr<const SessionView> session_view;
		const sptr<const TableEditorView> table_editor_view;

	private:
		MainWindow() = default;

		const RefPtr<Gtk::Builder> builder;

		[[nodiscard]]
		RefPtr<Builder> get_builder() const {
			auto builderRef = Gtk::Builder::create();
			builder->add_from_file("main.glade");

			return builderRef;
		}
	};
}


