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

	class MainView {
	public:
		explicit MainView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		Button& get_back_button() const;

		[[nodiscard]]
		Button& get_new_item_button() const;

		[[nodiscard]]
		Stack& get_main_stack() const;

		[[nodiscard]]
		StackSwitcher& get_deck_mode_stack_switcher() const;

		[[nodiscard]]
		Stack& get_deck_mode_stack() const;

		[[nodiscard]]
		Viewport& get_deck_list_viewport() const;

	private:
		MainView() = default;

		Button* back_button;
		Button* new_item_button;

		Stack* main_stack;

		StackSwitcher* deck_mode_stack_switcher;
		Stack* deck_mode_stack;
		Viewport* deck_list_viewport;
	};
}


