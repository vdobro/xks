using System.Threading.Tasks;
using XKS.Model;
using XKS.View;

namespace XKS.Controller
{
	public sealed class GraphEditorController
	{
		public Deck ActiveDeck { get; set; } = new Deck("DEFAULT");
		
		private readonly GraphEditorView _view;

		public GraphEditorController(GraphEditorView view)
		{
			_view = view;
		}

		public async Task Create(string name)
		{
			//TODO
		}
	}
}