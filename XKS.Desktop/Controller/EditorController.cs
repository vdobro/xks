using System;
using System.Threading.Tasks;
using XKS.Model;
using XKS.View;
using static XKS.Controller.EditorController.EditTab;

namespace XKS.Controller
{
	public sealed class EditorController
	{
		public EditTab ActiveEditTab =>
			_view.ElementCategoryTabs.Page switch
			{
				0 => Graphs,
				1 => Tables,
				_ => throw new IndexOutOfRangeException("Invalid tab")
			};

		public Deck ActiveDeck
		{
			get => _activeDeck;
			set
			{
				_activeDeck = value;
				
				_tableEditorController.ActiveDeck = value;
				_graphEditorController.ActiveDeck = value;
			}
		}

		private Deck _activeDeck;

		private readonly EditView _view;
		private readonly TableEditorController _tableEditorController;
		private readonly GraphEditorController _graphEditorController;

		public EditorController(EditView view,
		                      TableEditorController tableEditorController,
		                      GraphEditorController graphEditorController)
		{
			_view = view;
			_tableEditorController = tableEditorController;
			_graphEditorController = graphEditorController;
		}

		public void Refresh()
		{
			_tableEditorController.Refresh();
		}

		public async Task CreateObject(string name)
		{
			if (ActiveDeck == null)
				throw new InvalidOperationException("A deck must be selected for editing beforehand");
			switch (ActiveEditTab)
			{
				case Tables:
					await _tableEditorController.Create(name);
					break;
				case Graphs:
					await _graphEditorController.Create(name);
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}
		}

		public enum EditTab
		{
			Tables,
			Graphs,
		}
	}
}