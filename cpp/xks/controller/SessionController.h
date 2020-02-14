/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 27.01.2020
 */

#pragma once

#include <utility>

#include "../types.h"
#include "../view/SessionView.h"

using namespace xks::view;

namespace xks::controller {

	class SessionController {
	public:
		explicit SessionController(sptr<SessionView> view);

	private:
		const sptr<const SessionView> view;
	};
}

