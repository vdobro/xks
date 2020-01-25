//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class MainView {
	public:
		explicit MainView(const RefPtr<Builder>& builder) : MainView() {
			builder->get_widget("deckListViewport", deck_list_viewport);
			builder->get_widget("mainStack", main_stack);
			builder->get_widget("backButton", back_button);
			builder->get_widget("newItemButton", new_item_button);

			builder->get_widget("deckModeStackSwitcher", deck_mode_stack_switcher);
			builder->get_widget("deckModeStack", deck_mode_stack);
		}

		[[nodiscard]]
		Button& get_back_button() const {
			return *back_button;
		}

		[[nodiscard]]
		Button& get_new_item_button() const {
			return *new_item_button;
		}

		[[nodiscard]]
		Stack& get_main_stack() const {
			return *main_stack;
		}

		[[nodiscard]]
		StackSwitcher& get_deck_mode_stack_switcher() const {
			return *deck_mode_stack_switcher;
		}

		[[nodiscard]]
		Stack& get_deck_mode_stack() const {
			return *deck_mode_stack;
		}

		[[nodiscard]]
		Viewport& get_deck_list_viewport() const {
			return *deck_list_viewport;
		}

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


