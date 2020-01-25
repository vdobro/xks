//
// Created by Vitalijus Dobrovolskis on 24.01.20.
//

#pragma once

#include <iostream>
#include <gtkmm.h>

#include "boost/di.hpp"
#include "types.h"
#include "MainWindow.h"

using namespace Gtk;
using namespace di;

namespace xks {
	class MainApplication {
	public:
		MainApplication(int argc, char *argv[])
				: _application(Application::create(argc, argv, APPLICATION_ID)) {
			const auto window = MainWindow(UI_FILE);
			setup_di(window);
			//TODO gtk window reference to run
		}
	private:
		inline const static string APPLICATION_ID = "com.dobrovolskis.xks";
		inline const static string CONFIG_FILE = "appsettings.json";
		inline const static string UI_FILE = "main.glade";

		Glib::RefPtr<Application> _application;

		static void setup_di(const MainWindow& mainWindow) {
			auto injector = di::make_injector(
					//TODO
					);
		}
	};
}


