using System;
using Gtk;
using XKS.Model;
using XKS.View;

namespace XKS.Controller
{
	public class MainWindowOrchestrator
	{
		private readonly Button _newItemButton;
		private readonly Button _backButton;

		private readonly StackSwitcher _deckModeStackSwitcher;
		private readonly Stack         _mainStack;
		private readonly Viewport      _deckListViewport;
		private readonly Stack         _deckModeStack;

		private readonly NewDeckView  _newDeckView;
		private readonly DeckListView _deckListView;
		private readonly MainView     _mainView;

		public MainWindowOrchestrator(Button        newItemButton,
		                              Button        backButton,
		                              StackSwitcher deckModeStackSwitcher,
		                              Stack         mainStack,
		                              Stack         deckModeStack,
		                              Viewport      deckListViewport,
		                              NewDeckView   newDeckView,
		                              DeckListView  deckListView,
		                              MainView      mainView)
		{
			_newItemButton = newItemButton;
			_backButton = backButton;
			_deckModeStackSwitcher = deckModeStackSwitcher;
			_mainStack = mainStack;
			_deckModeStack = deckModeStack;
			_deckListViewport = deckListViewport;
			_newDeckView = newDeckView;
			_deckListView = deckListView;
			_mainView = mainView;
		}

		public async void Initialize()
		{
			await _deckListView.Initialize();
			_newDeckView.Initialize();

			ConnectEventHandlers();
		}

		private void ConnectEventHandlers()
		{
			_deckListView.OnDeckSelected += DeckListViewOnOnDeckSelected;
			_newDeckView.OnDeckCreated += NewDeckViewOnOnDeckCreated;

			_backButton.Clicked += BackButtonOnClicked;
		}

		private async void NewDeckViewOnOnDeckCreated(object? sender, EventArgs e)
		{
			await _deckListView.Refresh();
		}

		private void BackButtonOnClicked(object? sender, EventArgs e)
		{
			SwitchToDeckList();
		}

		private async void DeckListViewOnOnDeckSelected(object? sender, Deck e)
		{
			SwitchToDeckView();
			await _mainView.Initialize(e.ID);
		}

		private void NewItemButtonOnClicked(object? sender, EventArgs e)
		{
			_newDeckView.Activate();
		}

		private void SwitchToDeckView()
		{
			_mainStack!.VisibleChild = _deckModeStack;
			_deckModeStackSwitcher!.Show();
			_newItemButton!.Clicked -= NewItemButtonOnClicked;
			_backButton!.Show();
		}

		private void SwitchToDeckList()
		{
			_mainStack!.VisibleChild = _deckListViewport;
			_backButton.Hide();
			_deckModeStackSwitcher.Hide();
			_newItemButton!.Clicked += NewItemButtonOnClicked;
			_deckListView.DeckList.UnselectRow(_deckListView.DeckList.SelectedRow);
		}
	}
}