/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 27.01.2020
 */

#pragma once

#include <utility>

#include "../types.h"
#include "../view/EditView.h"

using namespace xks::view;

namespace xks::controller {

	class EditorController {
	public:
		explicit EditorController(sptr<EditView> view);

	private:
		const sptr<const EditView> view;
	};
}