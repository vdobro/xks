/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 27.01.2020
 */

#pragma once

#include <utility>

#include "../types.h"
#include "../view/NewItemDialogView.h"

using namespace xks::view;

namespace xks::controller {

	class NewItemDialogController {
	public:
		explicit NewItemDialogController(sptr<NewItemDialogView> view);

	private:
		const sptr<const NewItemDialogView> view;
	};
}