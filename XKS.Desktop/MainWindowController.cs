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
	public class MainWindowController : Window
	{
		#region UI

		[UI] private ListBox? deckList = null;
		[UI] private Stack? mainStack = null;
		[UI] private Button? newItemButton = null;
		[UI] private Popover? newItemPopover = null;
		[UI] private Entry? newItemTitleEntry = null;

		[UI] private StackSwitcher? deckModeStackSwitcher = null;
		[UI] private Stack? deckModeStack = null;
		[UI] private Box? questionViewBox = null;
		[UI] private InfoBar? answerFeedbackBar = null;
		[UI] private Label? questionLabel = null;
		[UI] private Entry? questionEntryBox  = null;
		[UI] private Label? correctAnswerLabel = null;
		[UI] private Label? actualAnswerLabel = null;
		[UI] private Button? acceptButton = null;

		#endregion

		private readonly DeckListView _deckListView;
		private readonly MainView _mainView;

		private readonly IDeckService _deckService;

		public MainWindowController(IDeckService deckService) 
			: this(new Builder(ResourceConfiguration.MainWindowFile), 
			       deckService)
		{
		}

		private MainWindowController(Builder builder, IDeckService deckService) 
			: base(builder.GetObject(ResourceConfiguration.MainUI).Handle)
		{
			_deckService = deckService;
			
			builder.Autoconnect(this);
			
			deckModeStackSwitcher!.Hide();
			
			_deckListView = new DeckListView( _deckService,
			                                  deckModeStack, 
			                                 deckList,
			                                 mainStack,
			                                 newItemButton);
			
			_mainView = new MainView(_deckService,
			                         deckModeStack, 
			                         questionViewBox,
			                         questionLabel, 
			                         questionEntryBox,
			                         answerFeedbackBar,
			                         correctAnswerLabel, 
			                         actualAnswerLabel,
			                         acceptButton);
		}
		
		public async void Initialize()
		{
			await _deckListView.Initialize();
			ConnectEventHandlers();
		}

		private void ConnectEventHandlers()
		{
			newItemButton!.Clicked += NewItemButtonOnClicked;
			newItemTitleEntry!.Activated += NewItemTitleEntryOnKeyPressEvent;
			
			_deckListView.OnDeckSelected += DeckListViewOnOnDeckSelected;
			DeleteEvent += Window_DeleteEvent;
		}

		private async void NewItemTitleEntryOnKeyPressEvent(object? o, EventArgs eventArgs)
		{
			await _deckService.Create(new Deck(newItemTitleEntry!.Text));
			newItemTitleEntry.Text = string.Empty;

			newItemPopover?.Hide();
			await _deckListView.PopulateList();
		}

		private void NewItemButtonOnClicked(object? sender, EventArgs e)
		{
			newItemPopover?.Show();
		}

		private async void DeckListViewOnOnDeckSelected(object? sender, Deck e)
		{
			mainStack!.VisibleChild = deckModeStack;
			await _mainView.Initialize(e.ID);
		}

		private void Window_DeleteEvent(object? sender, DeleteEventArgs a)
		{
			_deckListView.OnDeckSelected -= DeckListViewOnOnDeckSelected;
			Application.Quit();
		}
	}
}