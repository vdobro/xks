using System;
using XKS.View;

namespace XKS.Controller
{
	public class MainController
	{
		public event EventHandler OnBackButtonClicked = delegate { };
		public event EventHandler OnNewButtonClicked  = delegate { };
		
		public bool ActiveViewIsDeckList { get; private set; } = true;

		private readonly MainView _view;

		public MainController(MainView view)
		{
			_view = view;

			_view.NewItemButton.Clicked += NewItemButtonOnClicked;
			_view.BackButton.Clicked += BackButtonOnClicked;
		}

		public void SwitchToDeckView()
		{
			ActiveViewIsDeckList = false;
			_view.MainStack.VisibleChild = _view.DeckModeStack;
			_view.DeckModeStackSwitcher.Show();
			_view.BackButton.Show();
		}

		public void SwitchToDeckList()
		{
			ActiveViewIsDeckList = true;
			_view.BackButton.Hide();
			_view.DeckModeStackSwitcher.Hide();
			_view.MainStack.VisibleChild = _view.DeckListViewport;
		}

		private void NewItemButtonOnClicked(object? sender, EventArgs e)
		{
			OnNewButtonClicked?.Invoke(this, EventArgs.Empty);
		}

		private void BackButtonOnClicked(object? sender, EventArgs e)
		{
			_view.BackButton.Hide();
			OnBackButtonClicked?.Invoke(this, EventArgs.Empty);
		}
	}
}