cmake_minimum_required(VERSION 3.15)
project(xks)

set(CMAKE_CXX_STANDARD 17)

find_package(PkgConfig REQUIRED)
find_package(Boost REQUIRED)

pkg_check_modules(GTKMM gtkmm-3.0)

link_directories(${GTKMM_LIBRARY_DIRS})
include_directories(${GTKMM_INCLUDE_DIRS} ${Boost_INCLUDE_DIRS})

configure_file(main.glade main.glade COPYONLY)

add_executable(xks main.cpp MainApplication.h types.h MainWindow.h view/DeckListView.h view/EditView.h view/GraphEditorView.h view/MainView.h view/SessionView.h view/NewItemDialogView.h view/TableEditorView.h)

target_link_libraries(xks ${GTKMM_LIBRARIES})