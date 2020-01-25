using Gtk;

namespace XKS.View
{
	public sealed class DeckListView
	{
		public ListBox DeckList { get; }

		public DeckListView(ListBox deckList)
		{
			DeckList = deckList;
		}
	}
}