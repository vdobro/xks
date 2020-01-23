using Gtk;

namespace XKS.View
{
	public sealed class GraphEditorView
	{
		public ListBox GraphList { get; }
		
		public GraphEditorView(ListBox graphList)
		{
			GraphList = graphList;
		}
	}
}