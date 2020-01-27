//
// Created by Vitalijus Dobrovolskis on 25.01.2020
//

#pragma once

#include <gtkmm.h>

#include "../types.h"

using namespace Gtk;
using namespace Glib;

namespace xks::view {
	class SessionView {
	public:
		explicit SessionView(const RefPtr<Builder>& builder) : SessionView() {
			builder->get_widget("questionViewBox", question_view_box);
			builder->get_widget("answerFeedbackBar", answer_feedback_bar);
			builder->get_widget("questionLabel", question_label);
			builder->get_widget("questionEntryBox", question_entry_box);
			builder->get_widget("correctAnswerLabel", correct_answer_label);
			builder->get_widget("actualAnswerLabel", actual_answer_label);
			builder->get_widget("acceptButton", accept_button);
		}

		[[nodiscard]]
		Box& get_question_view_box() const {
			return *question_view_box;
		}

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

