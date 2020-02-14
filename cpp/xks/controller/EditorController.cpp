/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "EditorController.h"

xks::controller::EditorController::EditorController(sptr<EditView> view)
		: view(std::move(view)) {}