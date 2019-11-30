using System;
using Gtk;
using XKS.Model;
using XKS.Resource;
using XKS.Service;
using XKS.View;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.Controller
{
	public class MainWindowController : Window
	{
		private readonly DeckListView _deckListView;

		private readonly IDeckService _deckService;
		private readonly MainView     _mainView;
		
		#region UI

		[UI] private readonly ListBox? deckList          = null;
		[UI] private readonly Stack?   mainStack         = null;
		[UI] private readonly Button?  newItemButton     = null;
		[UI] private readonly Popover? newItemPopover    = null;
		[UI] private readonly Entry?   newItemTitleEntry = null;

		[UI] private readonly StackSwitcher? deckModeStackSwitcher = null;
		[UI] private readonly Stack?         deckModeStack         = null;
		[UI] private readonly Box?           questionViewBox       = null;
		[UI] private readonly InfoBar?       answerFeedbackBar     = null;
		[UI] private readonly Label?         questionLabel         = null;
		[UI] private readonly Entry?         questionEntryBox      = null;
		[UI] private readonly Label?         correctAnswerLabel    = null;
		[UI] private readonly Label?         actualAnswerLabel     = null;
		[UI] private readonly Button?        acceptButton          = null;

		#endregion
		
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

			_deckListView = new DeckListView(_deckService,
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
			var titleValue = newItemTitleEntry!.Text.Trim();
			if (string.IsNullOrWhiteSpace(titleValue))
			{
				return;
			}

			await _deckService.Create(new Deck(titleValue));
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