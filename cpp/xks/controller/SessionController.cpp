/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "SessionController.h"

xks::controller::SessionController::SessionController(sptr<SessionView> view)
		: view(std::move(view)) {}
