/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 27.01.2020
 */

#pragma once

#include <utility>

#include "types.h"

#include "controller/DeckListController.h"
#include "controller/EditorController.h"
#include "controller/MainController.h"
#include "controller/NewItemDialogController.h"
#include "controller/SessionController.h"

using namespace xks::controller;

namespace xks {

	class MainOrchestrator {
	public:
		explicit MainOrchestrator(
				sptr<NewItemDialogController> new_item_dialog_controller,
				sptr<DeckListController> deck_list_controller,
				sptr<MainController> main_controller,
				sptr<EditorController> editor_controller,
				sptr<SessionController> session_controller);

		void initialize();

	private:
		MainOrchestrator() = default;

		const sptr<NewItemDialogController> new_item_dialog_controller;
		const sptr<DeckListController> deck_list_controller;
		const sptr<MainController> main_controller;
		const sptr<EditorController> editor_controller;
		const sptr<SessionController> session_controller;
	};
}