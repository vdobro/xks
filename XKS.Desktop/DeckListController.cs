using Gtk;
using XKS.Model;
using XKS.Resource;
using XKS.Service;
using XKS.View;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS
{
	public class DeckListController : Window
	{
		#region UI

		[UI] private ListBox? deckList      = null;
		[UI] private Stack?   mainStack     = null;
		[UI] private Button?  newItemButton = null;

		[UI] private StackSwitcher? deckModeStackSwitcher = null;
		[UI] private Stack?         deckModeStack         = null;
		[UI] private Box?           questionViewBox       = null;
		[UI] private Label?         questionLabel         = null;
		[UI] private Entry?         questionEntryBox      = null;
		[UI] private InfoBar?       answerFeedbackBar     = null;
		[UI] private Label? 		correctAnswerLabel    = null;
		[UI] private Label?         actualAnswerLabel     = null;
		[UI] private Button?        acceptButton            = null;

		#endregion

		private readonly DeckListView _deckListView;

		public DeckListController(IDeckService deckService) 
			: this(new Builder(ResourceConfiguration.DeckListWindowFile), 
			       deckService)
		{
		}

		public async void Initialize()
		{
			await _deckListView.Initialize();
		} 
		
		private DeckListController(Builder builder, IDeckService deckService) 
			: base(builder.GetObject(ResourceConfiguration.DeckListUI).Handle)
		{
			builder.Autoconnect(this);
			
			deckModeStackSwitcher!.Hide();
			
			_deckListView = new DeckListView(deckModeStack, 
			                                 deckList,
			                                 mainStack,
			                                 newItemButton, 
			                                 deckService);
			
			DeleteEvent += Window_DeleteEvent;
		}

		private void ConnectEventHandlers()
		{
			_deckListView.OnDeckSelected += DeckListViewOnOnDeckSelected;
		}

		private void DeckListViewOnOnDeckSelected(object sender, Deck e)
		{
			mainStack.VisibleChild = deckModeStack;
			
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}
	}
}