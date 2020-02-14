/**
 * Copyright 2020 Vitalijus Dobrovolskis
 *
 * Created by Vitalijus Dobrovolskis on 06.02.2020
 */

#include "SessionView.h"

xks::view::SessionView::SessionView(const RefPtr<Builder>& builder) : SessionView() {
	builder->get_widget("questionViewBox", question_view_box);
	builder->get_widget("answerFeedbackBar", answer_feedback_bar);
	builder->get_widget("questionLabel", question_label);
	builder->get_widget("questionEntryBox", question_entry_box);
	builder->get_widget("correctAnswerLabel", correct_answer_label);
	builder->get_widget("actualAnswerLabel", actual_answer_label);
	builder->get_widget("acceptButton", accept_button);
}

Button& xks::view::SessionView::get_accept_button() const {
	return *accept_button;
}

Box& xks::view::SessionView::get_question_view_box() const {
	return *question_view_box;
}

Label& xks::view::SessionView::get_question_label() const {
	return *question_label;
}

Entry& xks::view::SessionView::get_question_entry_box() const {
	return *question_entry_box;
}

Label& xks::view::SessionView::get_correct_answer_label() const {
	return *correct_answer_label;
}

Label& xks::view::SessionView::get_actual_answer_label() const {
	return *actual_answer_label;
}

InfoBar& xks::view::SessionView::get_answer_feedback_bar() const {
	return *answer_feedback_bar;
}
