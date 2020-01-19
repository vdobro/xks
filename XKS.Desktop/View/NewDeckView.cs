using System;
using Gtk;
using XKS.Model;
using XKS.Service;

namespace XKS.View
{
	public class NewDeckView
	{
		public event EventHandler OnDeckCreated = delegate { };

		private readonly Popover      _newItemPopover;
		private readonly Entry        _newItemTitleEntry;
		private readonly IDeckService _deckService;

		public NewDeckView(IDeckService deckService,
		                   Popover      newItemPopover,
		                   Entry        newItemTitleEntry)
		{
			_newItemPopover = newItemPopover;
			_newItemTitleEntry = newItemTitleEntry;
			_deckService = deckService;
		}

		public void Initialize()
		{
			_newItemTitleEntry.Activated += NewItemTitleEntryOnKeyPressEvent;
		}

		public void Activate()
		{
			_newItemTitleEntry.Text = string.Empty;
			_newItemPopover.Show();
		}

		private async void NewItemTitleEntryOnKeyPressEvent(object? o, EventArgs eventArgs)
		{
			var titleValue = _newItemTitleEntry!.Text.Trim();
			if (string.IsNullOrWhiteSpace(titleValue))
			{
				return;
			}

			await _deckService.Create(new Deck(titleValue));
			_newItemTitleEntry.Text = string.Empty;

			_newItemPopover.Hide();

			OnDeckCreated.Invoke(this, EventArgs.Empty);
		}
	}
}