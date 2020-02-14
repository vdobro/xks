/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "MainView.h"

xks::view::MainView::MainView(const RefPtr<Builder>& builder) : MainView() {
	builder->get_widget("deckListViewport", deck_list_viewport);
	builder->get_widget("mainStack", main_stack);
	builder->get_widget("backButton", back_button);
	builder->get_widget("newItemButton", new_item_button);

	builder->get_widget("deckModeStackSwitcher", deck_mode_stack_switcher);
	builder->get_widget("deckModeStack", deck_mode_stack);
}

Button& xks::view::MainView::get_back_button() const {
	return *back_button;
}

Button& xks::view::MainView::get_new_item_button() const {
	return *new_item_button;
}

Stack& xks::view::MainView::get_main_stack() const {
	return *main_stack;
}

StackSwitcher& xks::view::MainView::get_deck_mode_stack_switcher() const {
	return *deck_mode_stack_switcher;
}

Stack& xks::view::MainView::get_deck_mode_stack() const {
	return *deck_mode_stack;
}

Viewport& xks::view::MainView::get_deck_list_viewport() const {
	return *deck_list_viewport;
}