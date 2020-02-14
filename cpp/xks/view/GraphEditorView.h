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

	class GraphEditorView {
	public:
		explicit GraphEditorView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		ListBox& get_graph_list() const;

	private:
		GraphEditorView() = default;

		ListBox* graph_list;
	};
}