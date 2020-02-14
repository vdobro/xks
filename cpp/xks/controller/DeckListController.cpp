/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "DeckListController.h"

xks::controller::DeckListController::DeckListController(sptr<DeckListView> view)
		: view(std::move(view)) {}
