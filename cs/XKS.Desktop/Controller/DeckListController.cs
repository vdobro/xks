using System;
using System.Threading.Tasks;
using XKS.Model;
using XKS.Service;
using XKS.View;
using XKS.View.Fragment;

namespace XKS.Controller
{
	public sealed class DeckListController
	{
		private readonly IDeckService _deckService;
		private readonly DeckListView _view;

		public DeckListController(IDeckService deckService,
		                          DeckListView view)
		{
			_deckService = deckService;
			_view = view;

			ConnectEventHandlers();
		}

		public event EventHandler<Deck> DeckSelected = delegate { };

		public async Task Initialize()
		{
			await PopulateList();
		}

		public async Task CreateDeck(string name)
		{
			await _deckService.Create(new Deck(name));
			await Refresh();
		}

		public async Task Refresh()
		{
			await PopulateList();
		}

		public void Resume()
		{
			_view.DeckList.UnselectRow(_view.DeckList.SelectedRow);
		}

		private async Task PopulateList()
		{
			var decks = await _deckService.GetAll();

			Utilities.ClearListBox(_view.DeckList);

			foreach (var deck in decks)
			{
				_view.DeckList.Add(new DeckListRow(deck));
			}

			_view.DeckList.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			_view.DeckList.RowSelected += OnDeckSelectionChanged;
		}

		private async void OnDeckSelectionChanged(object? o, EventArgs eventArgs)
		{
			var row = (DeckListRow) _view.DeckList.SelectedRow;
			if (row == null)
			{
				return;
			}

			var deck = await _deckService.Find(row.DeckId);
			DeckSelected.Invoke(this, deck);
		}
	}
}