/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "MainOrchestrator.h"

xks::MainOrchestrator::MainOrchestrator(
		sptr<NewItemDialogController> new_item_dialog_controller,
		sptr<DeckListController> deck_list_controller,
		sptr<MainController> main_controller,
		sptr<EditorController> editor_controller,
		sptr<SessionController> session_controller)
		: new_item_dialog_controller(std::move(new_item_dialog_controller)),
		  deck_list_controller(std::move(deck_list_controller)),
		  main_controller(std::move(main_controller)),
		  editor_controller(std::move(editor_controller)),
		  session_controller(std::move(session_controller)) {}

void xks::MainOrchestrator::initialize() {

}
