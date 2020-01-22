using Gtk;

namespace XKS.View
{
	public sealed class EditView
	{
		public Paned      EditStack          { get; }
		public Notebook   EditModeTabs       { get; }
		public Viewport   GraphTab           { get; }
		public ListBox    GraphList          { get; }
		public Viewport   TableTab           { get; }
		public ListBox    TableList          { get; }
		public Stack      ItemEditModeStack  { get; }
		public Toolbar    TableEditorToolbar { get; }
		public TreeView   TableEditor        { get; }
		public ToolButton AddColumnButton    { get; }

		public EditView(Paned      editStack,
		                Notebook   editModeTabs,
		                Viewport   graphTab,
		                ListBox    graphList,
		                Viewport   tableTab,
		                ListBox    tableList,
		                Stack      itemEditModeStack,
		                Toolbar    tableEditorToolbar,
		                TreeView   tableEditor,
		                ToolButton addColumnButton)
		{
			TableTab = tableTab;
			TableList = tableList;
			EditStack = editStack;
			EditModeTabs = editModeTabs;
			GraphTab = graphTab;
			GraphList = graphList;
			ItemEditModeStack = itemEditModeStack;
			TableEditorToolbar = tableEditorToolbar;
			TableEditor = tableEditor;
			AddColumnButton = addColumnButton;
		}
	}
}