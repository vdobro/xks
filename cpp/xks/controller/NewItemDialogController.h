//
// Created by Vitalijus Dobrovolskis on 27.01.2020
//

#pragma once

#include "../types.h"
#include "../view/NewItemDialogView.h"

using namespace xks::view;

namespace xks::controller {
	class NewItemDialogController {
	public:
		explicit NewItemDialogController(sptr<NewItemDialogView> view)
				: view(std::move(view)) {}

	private:
		const sptr<const NewItemDialogView> view;
	};
}