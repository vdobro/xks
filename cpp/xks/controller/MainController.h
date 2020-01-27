//
// Created by Vitalijus Dobrovolskis on 27.01.2020
//

#pragma once

#include "../types.h"
#include "../view/MainView.h"

using namespace xks::view;

namespace xks::controller {
	class MainController {
	public:
		explicit MainController(sptr<MainView> view)
				: view(std::move(view)) {}

	private:
		const sptr<const MainView> view;
	};
}