using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gtk;
using XKS.Model;
using XKS.Service;
using Action = System.Action;

namespace XKS.View
{
	public class DeckListView
	{
		public event EventHandler<Deck> OnDeckSelected;
		
		private readonly ListBox deckList;
		private readonly Stack   mainStack;
		private readonly Button  newItemButton;
		private readonly Stack   deckModeStack;

		private readonly IEnumerable<Deck> _decks;
		private readonly IDeckService _deckService;
		
		public DeckListView(Stack   deckModeStack,
		                    ListBox deckList,
		                    Stack   mainStack,
		                    Button  newItemButton,
		                    IDeckService deckService)
		{
			this.deckModeStack = deckModeStack ?? throw
					new ArgumentNullException(nameof(deckModeStack));
			this.deckList = deckList ?? throw
				                new ArgumentNullException(nameof(deckList));
			this.mainStack = mainStack ?? throw
				                 new ArgumentNullException(nameof(mainStack));
			this.newItemButton = newItemButton ?? throw
				                     new ArgumentNullException(nameof(newItemButton));
			_deckService = deckService;
		}

		public async Task Initialize()
		{
			await PopulateList();
			ConnectEventHandlers();
		}

		public async Task PopulateList()
		{
			var decks = await _deckService.GetAll();

			foreach (var listChild in deckList.Children)
			{
				deckList.Remove(listChild);
			}
			
			foreach (var deck in decks)
			{
				deckList.Add(new DeckListRow(deck));
			}
			
			deckList.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			deckList.SelectionNotifyEvent += OnDeckSelectionChanged;
		}

		private async void OnDeckSelectionChanged(object o, SelectionNotifyEventArgs args)
		{
			var row = (DeckListRow) args.RetVal;
			var deck = await _deckService.Find(row.DeckId);
			OnDeckSelected?.Invoke(this, deck);
		}

		class DeckListRow : ListBoxRow
		{
			public Guid DeckId { get; }
			
			public DeckListRow(Deck deck)
			{
				DeckId = deck.ID;
				Add(new Label(deck.Name)
				{
					HeightRequest = 64,
					WidthRequest = 100,
				});
			}
		}
	}
}