using System;
using GLib;
using XKS.View;

namespace XKS.Controller
{
	public sealed class MainController
	{
		private const string VisibleChildNotification = "visible-child";
		
		public event EventHandler BackButtonClicked = delegate { };
		public event EventHandler NewButtonClicked  = delegate { };
		public event EventHandler<DeckMode> DeckModeChanged = delegate { };
		
		public bool ActiveViewIsDeckList { get; private set; } = true; 

		private readonly MainView _view;
		
		private DeckMode _currentDeckMode = DeckMode.Session;

		public MainController(MainView view)
		{
			_view = view;

			_view.NewItemButton.Clicked += NewItemButtonOnClicked;
			_view.BackButton.Clicked += BackButtonOnClicked;
		}

		public void ShowNewItemButton()
		{
			_view.NewItemButton.Show();
		}

		public void HideNewItemButton()
		{
			_view.NewItemButton.Hide();
		}

		public void SwitchToDeckView()
		{
			ActiveViewIsDeckList = false;
			_view.MainStack.VisibleChild = _view.DeckModeStack;
			_view.DeckModeStackSwitcher.Show();
			_view.BackButton.Show();
			_view.DeckModeStack.AddNotification(VisibleChildNotification , OnDeckModeSwitch);
		}

		public void SwitchToDeckList()
		{
			ActiveViewIsDeckList = true;
			_view.BackButton.Hide();
			_view.DeckModeStackSwitcher.Hide();
			_view.MainStack.VisibleChild = _view.DeckListViewport;
			_view.DeckModeStack.RemoveNotification(OnDeckModeSwitch);
		}

		private void OnDeckModeSwitch(object o, NotifyArgs args)
		{
			var newMode = _view.DeckModeStack.VisibleChild == _view.EditStack ? DeckMode.Edit : DeckMode.Session;
			if (newMode == _currentDeckMode)
			{
				return;
			}

			_currentDeckMode = newMode;
			DeckModeChanged.Invoke(o, _currentDeckMode);
		}
		
		private void NewItemButtonOnClicked(object? sender, EventArgs e)
		{
			NewButtonClicked?.Invoke(this, EventArgs.Empty);
		}

		private void BackButtonOnClicked(object? sender, EventArgs e)
		{
			_view.BackButton.Hide();
			BackButtonClicked?.Invoke(this, EventArgs.Empty);
		}

		public enum DeckMode
		{
			Session,
			Edit
		}
	}
}