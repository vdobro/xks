//
// Created by Vitalijus Dobrovolskis on 24.01.2020
//

#pragma once

#include <iostream>
#include <gtkmm.h>

#include "boost/di.hpp"
#include "types.h"
#include "MainWindow.h"
#include "MainOrchestrator.h"

using namespace Gtk;
using namespace di;

namespace xks {
	class MainApplication {
	public:
		MainApplication(int argc, char* argv[])
				: application(Gtk::Application::create(argc, argv, APPLICATION_ID)),
				  main_window(make_unique<MainWindow>(get_builder(UI_FILE))),
				  gtk_window(main_window->get_window()) {
			auto di = main_window->get_injector();
			auto main_orchestrator = di.create<MainOrchestrator>();
			main_orchestrator.initialize();
		}

		void run() {
			application->run(*gtk_window);
			delete gtk_window;
		}

	private:
		inline const static string APPLICATION_ID = "com.dobrovolskis.xks";
		inline const static string CONFIG_FILE = "appsettings.json";
		inline const static string UI_FILE = "main.glade";

		const RefPtr<Application> application;
		const uptr<MainWindow> main_window;
		Window* const gtk_window;

		[[nodiscard]]
		static RefPtr<Builder> get_builder(const string& filename) {
			Glib::RefPtr<Gtk::Builder> builderRef = Gtk::Builder::create();
			try {
				builderRef->add_from_file(filename);
			}
			catch (const Glib::FileError& ex) {
				std::cerr << "FileError: " << ex.what() << std::endl;
			}
			catch (const Glib::MarkupError& ex) {
				std::cerr << "MarkupError: " << ex.what() << std::endl;
			}
			catch (const Gtk::BuilderError& ex) {
				std::cerr << "BuilderError: " << ex.what() << std::endl;
			}
			return builderRef;
		}
	};
}


