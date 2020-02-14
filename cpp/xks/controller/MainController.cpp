/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "MainController.h"

using namespace xks::controller;

MainController::MainController(sptr<MainView> view)
		: view(std::move(view)) {}
