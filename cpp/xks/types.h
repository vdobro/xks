/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 24.01.2020
 */

#pragma once

#include <string>
#include <utility>
#include <memory>

#include "boost/di.hpp"

namespace di = boost::di;

using string = std::string;

template<typename T>
using uptr = std::unique_ptr<T>;

template<typename T>
using sptr = std::shared_ptr<T>;

template<typename T>
using wptr = std::weak_ptr<T>;

using std::make_shared;
using std::make_unique;