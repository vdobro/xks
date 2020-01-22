using Gtk;

namespace XKS.View
{
	public sealed class SessionView
	{
		public Button  AcceptAnswerButton { get; }
		public Label   ActualAnswerLabel  { get; }
		public InfoBar AnswerFeedbackBar  { get; }
		public Label   CorrectAnswerLabel { get; }
		public Stack   LearningStack      { get; }
		public Entry   QuestionEntryBox   { get; }
		public Label   QuestionLabel      { get; }
		public Box     QuestionViewBox    { get; }

		public SessionView(Stack   learningStack,
		                   Box     questionViewBox,
		                   Label   questionLabel,
		                   Entry   questionEntryBox,
		                   InfoBar answerFeedbackBar,
		                   Label   correctAnswerLabel,
		                   Label   actualAnswerLabel,
		                   Button  acceptAnswerButton)
		{
			LearningStack = learningStack;
			QuestionViewBox = questionViewBox;
			QuestionLabel = questionLabel;
			QuestionEntryBox = questionEntryBox;
			AnswerFeedbackBar = answerFeedbackBar;
			CorrectAnswerLabel = correctAnswerLabel;
			ActualAnswerLabel = actualAnswerLabel;
			AcceptAnswerButton = acceptAnswerButton;
		}
	}
}