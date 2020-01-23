using Gtk;

namespace XKS.View
{
	public sealed class EditView
	{
		public Paned      EditStack           { get; }
		public Notebook   ElementCategoryTabs { get; }
		public Viewport   GraphTab            { get; }
		public Viewport   TableTab            { get; }
		public Stack      ItemEditModeStack   { get; }

		public EditView(Paned      editStack,
		                Notebook   elementCategoryTabs,
		                Viewport   graphTab,
		                Viewport   tableTab,
		                Stack      itemEditModeStack)
		{
			EditStack = editStack;
			ElementCategoryTabs = elementCategoryTabs;
			GraphTab = graphTab;
			TableTab = tableTab;
			ItemEditModeStack = itemEditModeStack;
		}
	}
}