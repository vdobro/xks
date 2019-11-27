using System;
using System.Threading.Tasks;
using Gtk;
using XKS.Model;
using XKS.Service;

namespace XKS.View
{
	public class DeckListView
	{
		private readonly ListBox _deckList;
		private readonly Stack   _deckModeStack;

		private readonly IDeckService _deckService;
		private readonly Stack        _mainStack;
		private readonly Button       _newItemButton;

		public DeckListView(IDeckService deckService,
		                    Stack?       deckModeStack,
		                    ListBox?     deckList,
		                    Stack?       mainStack,
		                    Button?      newItemButton)
		{
			_deckService = deckService;

			_deckModeStack = deckModeStack ?? throw new ArgumentNullException(nameof(deckModeStack));
			_deckList = deckList ?? throw new ArgumentNullException(nameof(deckList));
			_mainStack = mainStack ?? throw new ArgumentNullException(nameof(mainStack));
			_newItemButton = newItemButton ?? throw new ArgumentNullException(nameof(newItemButton));
		}

		public event EventHandler<Deck> OnDeckSelected = delegate { };

		public async Task Initialize()
		{
			await PopulateList();
			ConnectEventHandlers();
		}

		public async Task PopulateList()
		{
			var decks = await _deckService.GetAll();

			foreach (var listChild in _deckList.Children)
			{
				_deckList.Remove(listChild);
			}

			foreach (var deck in decks)
			{
				_deckList.Add(new DeckListRow(deck));
			}

			_deckList.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			_deckList.SelectionNotifyEvent += OnDeckSelectionChanged;
		}

		private async void OnDeckSelectionChanged(object o, SelectionNotifyEventArgs args)
		{
			var row = (DeckListRow) args.RetVal;
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