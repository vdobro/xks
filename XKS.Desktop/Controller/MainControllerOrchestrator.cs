using System;
using XKS.Model;

namespace XKS.Controller
{
	public class MainControllerOrchestrator
	{
		private readonly DeckListController      _deckListController;
		private readonly EditController          _editController;
		private readonly MainController          _mainController;
		private readonly NewDeckDialogController _newDeckDialogController;
		private readonly SessionController       _sessionController;

		public MainControllerOrchestrator(NewDeckDialogController newDeckDialogController,
		                                  DeckListController      deckListController,
		                                  MainController          mainController,
		                                  EditController          editController,
		                                  SessionController       sessionController)
		{
			_newDeckDialogController = newDeckDialogController;
			_deckListController = deckListController;
			_mainController = mainController;
			_editController = editController;
			_sessionController = sessionController;
		}

		public async void Initialize()
		{
			_newDeckDialogController.OnDeckCreated += NewDeckViewOnOnDeckCreated;
			_deckListController.OnDeckSelected += DeckListViewOnOnDeckSelected;
			_mainController.OnBackButtonClicked += OnBackButtonClicked;
			_mainController.OnNewButtonClicked += OnNewButtonClicked;

			await _deckListController.Initialize();
		}

		private void OnNewButtonClicked(object? sender, EventArgs e)
		{
			if (_mainController.ActiveViewIsDeckList)
			{
				_newDeckDialogController.Open();
			}
		}

		private void OnBackButtonClicked(object? sender, EventArgs e)
		{
			_mainController.SwitchToDeckList();
			_deckListController.Resume();
		}

		private void DeckListViewOnOnDeckSelected(object? sender, Deck e)
		{
			_mainController.SwitchToDeckView();
		}

		private async void NewDeckViewOnOnDeckCreated(object? sender, EventArgs e)
		{
			await _deckListController.Refresh();
		}
	}
}