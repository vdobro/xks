using Gtk;

namespace XKS.View
{
	public sealed class MainView
	{
		public Button        NewItemButton         { get; }
		public Button        BackButton            { get; }
		public StackSwitcher DeckModeStackSwitcher { get; }
		public Stack         MainStack             { get; }
		public Viewport      DeckListViewport      { get; }
		public Stack         DeckModeStack         { get; }
		public Box           QuestionViewBox       { get; }
		public Paned         EditStack             { get; }

		public MainView(Button        newItemButton,
		                Button        backButton,
		                StackSwitcher deckModeStackSwitcher,
		                Stack         mainStack,
		                Viewport      deckListViewport,
		                Stack         deckModeStack,
		                Box           questionViewBox,
		                Paned         editStack)
		{
			NewItemButton = newItemButton;
			BackButton = backButton;
			DeckModeStackSwitcher = deckModeStackSwitcher;
			MainStack = mainStack;
			DeckListViewport = deckListViewport;
			DeckModeStack = deckModeStack;
			QuestionViewBox = questionViewBox;
			EditStack = editStack;
		}
	}
}