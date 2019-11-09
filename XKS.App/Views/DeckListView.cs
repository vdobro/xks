using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gtk;
using XKS.Common.Entities;
using XKS.Core.Decks.Models;
using XKS.Core.Service;

namespace XKS.App.Views
{
	public class DeckListView
	{
		private readonly ListBox deckList;
		private readonly Stack   mainStack;
		private readonly Button  newDeckButton;
		private readonly Stack   deckModeStack;

		private readonly IEnumerable<DeckDto> _decks;
		private readonly IDeckService _deckService;
		
		public DeckListView(Stack   deckModeStack,
		                    ListBox deckList,
		                    Stack   mainStack,
		                    Button  newDeckButton,
		                    IDeckService deckService)
		{
			this.deckModeStack =
				deckModeStack ?? throw
					new ArgumentNullException(nameof(deckModeStack));
			this.deckList = deckList ?? throw
				                new ArgumentNullException(nameof(deckList));
			this.mainStack = mainStack ?? throw
				                 new ArgumentNullException(nameof(mainStack));
			this.newDeckButton = newDeckButton ?? throw
				                     new ArgumentNullException(nameof(newDeckButton));
			_deckService = deckService;

			ConnectEventHandlers();
		}

		private async Task Initialize()
		{
			var decks = await _deckService.GetAll();

			foreach (var deck in decks)
			{
				deckList.Add(new DeckListRow(deck));
			}
			
			deckList.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			deckList.SelectionNotifyEvent += (o, args) =>
			{
				var row = (DeckListRow) deckList.SelectedRow;
				Console.WriteLine(row.DeckId);
			};
		}

		class DeckListRow : ListBoxRow
		{
			public Guid DeckId { get; }
			
			public DeckListRow(DeckDto deck)
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