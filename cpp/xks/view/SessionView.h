/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 25.01.2020
 */

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {

	class SessionView {
	public:
		explicit SessionView(const RefPtr<Builder>& builder);

		[[nodiscard]]
		Button& get_accept_button() const;

		[[nodiscard]]
		Box& get_question_view_box() const;

		[[nodiscard]]
		Label& get_question_label() const;

		[[nodiscard]]
		Entry& get_question_entry_box() const;

		[[nodiscard]]
		Label& get_correct_answer_label() const;

		[[nodiscard]]
		Label& get_actual_answer_label() const;

		[[nodiscard]]
		InfoBar& get_answer_feedback_bar() const;

	private:
		SessionView() = default;

		Button* accept_button;
		Box* question_view_box;
		Label* question_label;
		Entry* question_entry_box;
		Label* correct_answer_label;
		Label* actual_answer_label;
		InfoBar* answer_feedback_bar;
	};
}

