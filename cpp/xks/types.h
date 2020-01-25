//
// Created by Vitalijus Dobrovolskis on 24.01.2020
//

#pragma once

namespace di = boost::di;
#include <string>

using string = std::string;

template<typename T>
using uptr = std::unique_ptr<T>;

template<typename T>
using sptr = std::shared_ptr<T>;

template<typename T>
using wptr = std::weak_ptr<T>;
