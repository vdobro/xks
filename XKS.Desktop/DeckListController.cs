using System;
using System.Threading.Tasks;
using Gtk;
using XKS.Model;
using XKS.Resource;
using XKS.Service;
using XKS.View;
using Key = Gdk.Key;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS
{
	public class DeckListController : Window
	{
		#region UI

		[UI] private ListBox? deckList      = null;
		[UI] private Stack?   mainStack     = null;
		[UI] private Button?  newItemButton = null;
		[UI] private Popover? newItemPopover = null;
		[UI] private Entry? newItemTitleEntry = null;

		[UI] private StackSwitcher? deckModeStackSwitcher = null;
		[UI] private Stack?         deckModeStack         = null;
		[UI] private Box?           questionViewBox       = null;
		[UI] private Label?         questionLabel         = null;
		[UI] private Entry?         questionEntryBox      = null;
		[UI] private InfoBar?       answerFeedbackBar     = null;
		[UI] private Label? 		correctAnswerLabel    = null;
		[UI] private Label?         actualAnswerLabel     = null;
		[UI] private Button?        acceptButton          = null;

		#endregion

		private readonly DeckListView _deckListView;

		private readonly IDeckService _deckService;

		public DeckListController(IDeckService deckService) 
			: this(new Builder(ResourceConfiguration.DeckListWindowFile), 
			       deckService)
		{
		}

		public async void Initialize()
		{
			await _deckListView.Initialize();
			ConnectEventHandlers();
		} 
		
		private DeckListController(Builder builder, IDeckService deckService) 
			: base(builder.GetObject(ResourceConfiguration.DeckListUI).Handle)
		{
			_deckService = deckService;
			
			builder.Autoconnect(this);
			
			deckModeStackSwitcher!.Hide();
			
			_deckListView = new DeckListView(deckModeStack, 
			                                 deckList,
			                                 mainStack,
			                                 newItemButton, 
			                                 _deckService);
		}

		private void ConnectEventHandlers()
		{
			newItemButton.Clicked += NewItemButtonOnClicked;
			newItemTitleEntry.Activated += NewItemTitleEntryOnKeyPressEvent;
			
			_deckListView.OnDeckSelected += DeckListViewOnOnDeckSelected;
			DeleteEvent += Window_DeleteEvent;
		}

		private async void NewItemTitleEntryOnKeyPressEvent(object o, EventArgs eventArgs)
		{
			await _deckService.Create(new Deck(newItemTitleEntry.Text));
			newItemTitleEntry.Text = String.Empty;

			await _deckListView.PopulateList();
		}

		private void NewItemButtonOnClicked(object sender, EventArgs e)
		{
			newItemPopover.Show();
		}

		private void DeckListViewOnOnDeckSelected(object sender, Deck e)
		{
			mainStack.VisibleChild = deckModeStack;
			if (e.Tables.Count == 0 && e.Graphs.Count == 0)
			{
				
			}
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			_deckListView.OnDeckSelected -= DeckListViewOnOnDeckSelected;
			Application.Quit();
		}
	}
}