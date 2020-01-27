cmake_minimum_required(VERSION 3.15)
project(xks)

set(CMAKE_CXX_STANDARD 17)

set(CMAKE_CXX_FLAGS "-Wall -Wextra -mwindows -Wno-long-long -Wno-sign-compare -Wnull-dereference -pedantic-errors")
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

find_package(PkgConfig REQUIRED)
find_package(Boost REQUIRED)

pkg_check_modules(GTKMM gtkmm-3.0)

link_directories(${GTKMM_LIBRARY_DIRS})
include_directories(${GTKMM_INCLUDE_DIRS} ${Boost_INCLUDE_DIRS})

configure_file(main.glade main.glade COPYONLY)

add_executable(xks
		main.cpp
		types.h
		MainApplication.h
		MainWindow.h
		MainOrchestrator.h
		view/DeckListView.h
		view/EditView.h
		view/GraphEditorView.h
		view/MainView.h
		view/SessionView.h
		view/NewItemDialogView.h
		view/TableEditorView.h
		controller/NewItemDialogController.h
		controller/DeckListController.h
		controller/MainController.h
		controller/EditorController.h
		controller/SessionController.h)

target_link_libraries(xks ${GTKMM_LIBRARIES})