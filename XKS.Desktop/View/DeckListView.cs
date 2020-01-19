using System;
using System.Threading.Tasks;
using Gtk;
using XKS.Model;
using XKS.Service;

namespace XKS.View
{
	public class DeckListView
	{
		public event EventHandler<Deck> OnDeckSelected = delegate { };

		public ListBox DeckList { get; }

		private readonly IDeckService _deckService;

		public DeckListView(IDeckService deckService,
		                    ListBox      deckList)
		{
			_deckService = deckService;

			DeckList = deckList;
		}

		public async Task Initialize()
		{
			await PopulateList();
			ConnectEventHandlers();
		}

		public async Task Refresh()
		{
			await PopulateList();
		}

		private async Task PopulateList()
		{
			var decks = await _deckService.GetAll();

			foreach (var listChild in DeckList.Children)
			{
				DeckList.Remove(listChild);
			}

			foreach (var deck in decks)
			{
				DeckList.Add(new DeckListRow(deck));
			}

			DeckList.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			DeckList.RowSelected += OnDeckSelectionChanged;
		}

		private async void OnDeckSelectionChanged(object? o, EventArgs eventArgs)
		{
			var row = (DeckListRow) DeckList.SelectedRow;
			if (row == null) return;

			var deck = await _deckService.Find(row.DeckId);
			OnDeckSelected?.Invoke(this, deck);
		}

		private class DeckListRow : ListBoxRow
		{
			public Guid DeckId { get; }

			public DeckListRow(Deck deck)
			{
				DeckId = deck.ID;
				Add(new Label(deck.Name)
				{
					HeightRequest = 64,
					WidthRequest = 100
				});
			}
		}
	}
}