using System;
using Gtk;
using XKS.Model;

namespace XKS.View
{
	internal sealed class DeckListRow : ListBoxRow
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