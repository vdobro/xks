using Gtk;

namespace XKS.View
{
	public sealed class NewDeckDialogView
	{
		public Popover NewItemPopover    { get; }
		public Entry   NewItemTitleEntry { get; }

		public NewDeckDialogView(Popover newItemPopover,
		                         Entry   newItemTitleEntry)
		{
			NewItemPopover = newItemPopover;
			NewItemTitleEntry = newItemTitleEntry;
		}
	}
}