/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "NewItemDialogView.h"

xks::view::NewItemDialogView::NewItemDialogView(const RefPtr<Builder>& builder) : NewItemDialogView() {
	builder->get_widget("newElementPopover", new_item_popover);
	builder->get_widget("nameLabel", name_label);
	builder->get_widget("newElementTitleEntry", new_item_title_entry);
}

Popover& xks::view::NewItemDialogView::get_new_item_popover() const {
	return *new_item_popover;
}

Label& xks::view::NewItemDialogView::get_name_label() const {
	return *name_label;
}

Entry& xks::view::NewItemDialogView::get_new_item_title_entry() const {
	return *new_item_title_entry;
}