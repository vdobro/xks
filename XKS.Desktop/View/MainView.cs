using System;
using System.Threading.Tasks;
using Gtk;
using XKS.Model;
using XKS.Service;

namespace XKS.View
{
	public class MainView
	{
		private readonly IDeckService _deckService;
		private readonly Stack _learningStack;

		private readonly Box   _questionViewBox;
		private readonly Label _questionLabel;
		private readonly Entry _questionEntryBox;
		private readonly InfoBar _answerFeedbackBar;
		private readonly Label _correctAnswerLabel;
		private readonly Label _actualAnswerLabel;
		private readonly Button _acceptAnswerButton;

		public MainView(IDeckService deckService,
		                Stack? learningStack,
		                Box?   questionViewBox,
		                Label? questionLabel,
		                Entry? questionEntryBox,
		                InfoBar? answerFeedbackBar,
		                Label? correctAnswerLabel,
		                Label? actualAnswerLabel,
		                Button? acceptAnswerButton)
		{
			_deckService = deckService;
			
			_learningStack = learningStack ?? throw new ArgumentNullException(nameof(learningStack));
			_questionViewBox = questionViewBox ?? throw new ArgumentNullException(nameof(questionViewBox));
			_questionLabel = questionLabel ?? throw new ArgumentNullException(nameof(questionLabel));
			_questionEntryBox = questionEntryBox ?? throw new ArgumentNullException(nameof(questionEntryBox));
			_answerFeedbackBar = answerFeedbackBar ?? throw new ArgumentNullException(nameof(answerFeedbackBar));
			_correctAnswerLabel = correctAnswerLabel ?? throw new ArgumentNullException(nameof(correctAnswerLabel));
			_actualAnswerLabel = actualAnswerLabel ?? throw new ArgumentNullException(nameof(actualAnswerLabel));
			_acceptAnswerButton = acceptAnswerButton ?? throw new ArgumentNullException(nameof(acceptAnswerButton));
			
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