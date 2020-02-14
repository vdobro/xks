/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 24.01.2020
 */

#pragma once

#include <iostream>
#include <gtkmm.h>
#include <memory>

#include "boost/di.hpp"
#include "types.h"
#include "MainWindow.h"
#include "MainOrchestrator.h"

using namespace Gtk;
using namespace di;

namespace xks {

	class MainApplication {
	public:
		explicit MainApplication(int argc, char* argv[]);

		void run();

	private:
		inline const static string APPLICATION_ID = "com.dobrovolskis.xks"; // NOLINT(cert-err58-cpp)
		inline const static string CONFIG_FILE = "appsettings.json"; // NOLINT(cert-err58-cpp)

		inline const static string RESOURCE_PATH = "resources/"; // NOLINT(cert-err58-cpp)
		inline const static string UI_FILE = RESOURCE_PATH + "main.glade"; // NOLINT(cert-err58-cpp)

		const RefPtr<Application> application;
		const uptr<MainWindow> main_window;
		Window* const gtk_window;

		[[nodiscard]]
		static RefPtr<Builder> get_builder(const string& filename);
	};
}