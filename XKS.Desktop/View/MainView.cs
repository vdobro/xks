using System;
using System.Threading.Tasks;
using Gtk;
using XKS.Service;

namespace XKS.View
{
	public class MainView
	{
		private readonly Button       _acceptAnswerButton;
		private readonly Label        _actualAnswerLabel;
		private readonly InfoBar      _answerFeedbackBar;
		private readonly Label        _correctAnswerLabel;
		private readonly IDeckService _deckService;
		private readonly Stack        _learningStack;
		private readonly Entry        _questionEntryBox;
		private readonly Label        _questionLabel;

		private readonly Box _questionViewBox;

		public MainView(IDeckService deckService,
		                Stack        learningStack,
		                Box          questionViewBox,
		                Label        questionLabel,
		                Entry        questionEntryBox,
		                InfoBar      answerFeedbackBar,
		                Label        correctAnswerLabel,
		                Label        actualAnswerLabel,
		                Button       acceptAnswerButton)
		{
			_deckService = deckService;

			_learningStack = learningStack;
			_questionViewBox = questionViewBox;
			_questionLabel = questionLabel;
			_questionEntryBox = questionEntryBox;
			_answerFeedbackBar = answerFeedbackBar;
			_correctAnswerLabel = correctAnswerLabel;
			_actualAnswerLabel = actualAnswerLabel;
			_acceptAnswerButton = acceptAnswerButton;

			ConnectEventHandlers();
		}

		public async Task Initialize(Guid deckId)
		{
			var deck = await _deckService.Find(deckId);
			Console.WriteLine($"Deck {deck.Name} was chosen");
		}

		private void ConnectEventHandlers()
		{
		}
	}
}