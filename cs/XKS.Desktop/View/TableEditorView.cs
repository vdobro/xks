using Gtk;

namespace XKS.View
{
	public sealed class TableEditorView
	{
		public ListBox    TableList          { get; }
		public Toolbar    TableEditorToolbar { get; }
		public TreeView   TableEditor        { get; }
		public ToolButton AddColumnButton    { get; }

		public TableEditorView(ListBox    tableList,
		                       Toolbar    tableEditorToolbar,
		                       TreeView   tableEditor,
		                       ToolButton addColumnButton)
		{
			TableList = tableList;
			TableEditorToolbar = tableEditorToolbar;
			AddColumnButton = addColumnButton;
			TableEditor = tableEditor;
		}
	}
}