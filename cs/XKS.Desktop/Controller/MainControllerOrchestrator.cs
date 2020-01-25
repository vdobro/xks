using System;
using XKS.Model;
using static XKS.Controller.EditorController.EditTab;
using static XKS.Controller.MainController.DeckMode;

namespace XKS.Controller
{
	public sealed class MainControllerOrchestrator
	{
		private readonly MainController _mainController;

		private readonly NewElementDialogController _newElementDialogController;

		private readonly DeckListController _deckListController;

		private readonly EditorController  _editorController;
		private readonly SessionController _sessionController;

		public MainControllerOrchestrator(NewElementDialogController newElementDialogController,
		                                  DeckListController         deckListController,
		                                  MainController             mainController,
		                                  EditorController           editorController,
		                                  SessionController          sessionController)
		{
			_newElementDialogController = newElementDialogController;
			_deckListController = deckListController;
			_mainController = mainController;
			_editorController = editorController;
			_sessionController = sessionController;
		}

		public async void Initialize()
		{
			_mainController.BackButtonClicked += OnBackButtonClicked;
			_mainController.NewButtonClicked += OnNewButtonClicked;
			_mainController.DeckModeChanged += OnDeckModeChanged;

			_newElementDialogController.ElementCreated += OnElementCreated;

			_deckListController.DeckSelected += OnDeckSelected;

			await _deckListController.Initialize();
		}

		private void OnDeckModeChanged(object? sender, MainController.DeckMode deckMode)
		{
			switch (deckMode)
			{
				case Session:
					_mainController.HideNewItemButton();
					_sessionController.SetDefaultFocus();
					break;
				case Edit:
					_mainController.ShowNewItemButton();
					_editorController.Refresh();
					break;
				default:
					throw new ArgumentOutOfRangeException(nameof(deckMode), deckMode, string.Empty);
			}
		}

		private void OnNewButtonClicked(object? sender, EventArgs e)
		{
			if (_mainController.ActiveViewIsDeckList)
			{
				_newElementDialogController.NameLabelText = "Deck name:";
				_newElementDialogController.Open();
			}
			else
			{
				_newElementDialogController.NameLabelText = _editorController.ActiveEditTab switch
				{
					Tables => "Table name:",
					Graphs => "Graph name:",
					_ => "Object name:",
				};
				_newElementDialogController.Open();
			}
		}

		private void OnBackButtonClicked(object? sender, EventArgs e)
		{
			_mainController.SwitchToDeckList();
			_deckListController.Resume();
		}

		private void OnDeckSelected(object? sender, Deck selectedDeck)
		{
			_newElementDialogController.Close();
			_editorController.ActiveDeck = selectedDeck;
			_mainController.SwitchToDeckView();
			_editorController.Refresh();
			_sessionController.SetDefaultFocus();
		}

		private async void OnElementCreated(object? sender, string name)
		{
			if (_mainController.ActiveViewIsDeckList)
			{
				await _deckListController.CreateDeck(name);
			}
			else
			{
				await _editorController.CreateObject(name);
			}
		}
	}
}