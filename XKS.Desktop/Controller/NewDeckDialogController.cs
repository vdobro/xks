using System;
using Gtk;
using XKS.Model;
using XKS.Service;
using XKS.View;

namespace XKS.Controller
{
	public class NewDeckDialogController
	{
		private readonly IDeckService _deckService;

		private readonly Popover _newItemPopover;
		private readonly Entry   _newItemTitleEntry;

		public NewDeckDialogController(NewDeckDialogView newDeckDialogView, IDeckService deckService)
		{
			_newItemPopover = newDeckDialogView.NewItemPopover;
			_newItemTitleEntry = newDeckDialogView.NewItemTitleEntry;
			_deckService = deckService;

			_newItemTitleEntry.Activated += NewItemTitleEntryOnKeyPressEvent;
		}

		public event EventHandler OnDeckCreated = delegate { };

		public void Open()
		{
			_newItemTitleEntry.Text = string.Empty;
			_newItemPopover.Show();
		}

		public void Close()
		{
			_newItemTitleEntry.Text = string.Empty;
			_newItemPopover.Hide();
		}

		private async void NewItemTitleEntryOnKeyPressEvent(object? o, EventArgs eventArgs)
		{
			var titleValue = _newItemTitleEntry.Text.Trim();
			if (string.IsNullOrWhiteSpace(titleValue))
			{
				return;
			}

			await _deckService.Create(new Deck(titleValue));
			Close();

			OnDeckCreated.Invoke(this, EventArgs.Empty);
		}
	}
}