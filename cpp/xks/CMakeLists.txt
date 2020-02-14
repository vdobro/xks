cmake_minimum_required(VERSION 3.15)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
project(xks)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_CLANG_TIDY)

IF (WIN32)
    set(CMAKE_CXX_FLAGS "-Wall -Wextra -mwindows -Wno-long-long -Wno-sign-compare -Wnull-dereference -pedantic-errors")
ELSE ()
    set(CMAKE_CXX_FLAGS "-Wall -Wextra -Wno-long-long -Wno-sign-compare -Wnull-dereference -pedantic-errors")
ENDIF ()

set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

find_package(PkgConfig REQUIRED)
find_package(Boost REQUIRED)

pkg_check_modules(GTKMM gtkmm-3.0)

link_directories(${GTKMM_LIBRARY_DIRS})
include_directories(${GTKMM_INCLUDE_DIRS} ${Boost_INCLUDE_DIRS})

configure_file(resources/main.glade
        resources/main.glade
        COPYONLY)

add_executable(${PROJECT_NAME}
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
        controller/SessionController.h
        view/DeckListView.cpp
        view/EditView.cpp
        view/GraphEditorView.cpp
        view/MainView.cpp
        view/NewItemDialogView.cpp
        view/SessionView.cpp
        view/TableEditorView.cpp
        MainApplication.cpp
        controller/DeckListController.cpp
        controller/EditorController.cpp
        controller/MainController.cpp
        controller/NewItemDialogController.cpp
        controller/SessionController.cpp
        MainOrchestrator.cpp
        MainWindow.cpp)

target_link_libraries(xks ${GTKMM_LIBRARIES})