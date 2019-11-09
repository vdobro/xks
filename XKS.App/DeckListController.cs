using Gtk;
using XKS.App.Resource;
using XKS.App.Views;
using XKS.Core.Service;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.App
{
	public class DeckListController : Window
	{
		#region UI

		[UI] private ListBox? deckList      = null;
		[UI] private Stack?   mainStack     = null;
		[UI] private Button?  newDeckButton = null;

		[UI] private StackSwitcher? deckModeStackSwitcher = null;
		[UI] private Stack?         deckModeStack         = null;
		[UI] private Stack?         learningStack         = null;
		[UI] private Box?           questionViewBox       = null;
		[UI] private Label?         questionLabel         = null;
		[UI] private Entry?         questionEntryBox      = null;
		[UI] private Box?           answerViewBox         = null;
		[UI] private Label?         answerLabel           = null;
		[UI] private Button?        nextQuestionButton    = null;
		[UI] private Button?        typoButton            = null;

		#endregion

		private readonly DeckListView _deckListView;

		private readonly IDeckService _deckService;
		
		public DeckListController(IDeckService deckService) : this(
			new Builder(ResourceConfiguration.DeckListWindowFile), deckService)
		{
		}
		
		private DeckListController(Builder builder, 
		                           IDeckService deckService) : base(builder
			.GetObject(ResourceConfiguration.DeckListUI).Handle)
		{
			_deckService = deckService;
			builder.Autoconnect(this);
			
			deckModeStackSwitcher.Hide();
			
			_deckListView = new DeckListView(deckModeStack, 
			                                 deckList,
			                                 mainStack,
			                                 newDeckButton, 
			                                 deckService);
			
			DeleteEvent += Window_DeleteEvent;
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}
	}
}