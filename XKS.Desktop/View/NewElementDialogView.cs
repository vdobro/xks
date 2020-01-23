using Gtk;

namespace XKS.View
{
	public sealed class NewElementDialogView
	{
		public Popover NewItemPopover    { get; }
		public Label   NameLabel         { get; }
		public Entry   NewItemTitleEntry { get; }

		public NewElementDialogView(Popover newItemPopover,
		                            Label   nameLabel,
		                            Entry   newItemTitleEntry)
		{
			NewItemPopover = newItemPopover;
			NameLabel = nameLabel;
			NewItemTitleEntry = newItemTitleEntry;
		}
	}
}