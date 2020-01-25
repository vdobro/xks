#include <gtkmm.h>

#include "MainApplication.h"

using namespace Gtk;
using namespace xks;

int main(int argc, char *argv[]) {
	MainApplication app(argc, argv);

    //quit_button.signal_clicked().connect(sigc::ptr_fun(&Gtk::Main::quit));

    //Main::run(window);
    return 0;
}