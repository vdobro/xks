/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 27.01.2020
 */

#pragma once

#include <utility>

#include "../types.h"
#include "../view/DeckListView.h"

using namespace xks::view;

namespace xks::controller {

	class DeckListController {
	public:
		explicit DeckListController(sptr<DeckListView> view);

	private:
		const sptr<const DeckListView> view;
	};
}