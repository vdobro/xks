//
// Created by Vitalijus Dobrovolskis on 27.01.2020
//

#pragma once

#include "../types.h"
#include "../view/DeckListView.h"

using namespace xks::view;

namespace xks::controller {

	class DeckListController {
	public:
		explicit DeckListController(sptr<DeckListView> view)
				: view(std::move(view)) {}

	private:
		const sptr<const DeckListView> view;
	};
}