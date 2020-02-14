/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "NewItemDialogController.h"

xks::controller::NewItemDialogController::NewItemDialogController(sptr<NewItemDialogView> view)
		: view(std::move(view)) {}
