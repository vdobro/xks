//
// Created by Vitalijus Dobrovolskis on 27.01.2020
//

#pragma once

#include "../types.h"
#include "../view/EditView.h"

using namespace xks::view;

namespace xks::controller {
	class EditorController {
	public:
		explicit EditorController(sptr<EditView> view)
				: view(std::move(view)) {}

	private:
		const sptr<const EditView> view;
	};
}