/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "MainApplication.h"

xks::MainApplication::MainApplication(int argc, char** argv)
		: application(Gtk::Application::create(argc, argv, APPLICATION_ID)),
		  main_window(make_unique<MainWindow>(get_builder(UI_FILE))),
		  gtk_window(main_window->get_window()) {
	auto di = main_window->get_injector();
	auto main_orchestrator = di.create<MainOrchestrator>();
	main_orchestrator.initialize();
}

void xks::MainApplication::run() {
	application->run(*gtk_window);
	delete gtk_window;
}

RefPtr<Builder> xks::MainApplication::get_builder(const string& filename) {
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
