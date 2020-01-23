using System;
using System.Threading.Tasks;
using XKS.Model;
using XKS.Service;
using XKS.View;
using XKS.View.Fragment;

namespace XKS.Controller
{
	public sealed class TableEditorController
	{
		public Deck ActiveDeck { get; set; } = new Deck("DEFAULT");

		private readonly TableEditorView _view;
		private readonly ITableService   _tableService;

		public TableEditorController(TableEditorView view, 
		                             ITableService tableService)
		{
			_view = view;
			_tableService = tableService;
			
			ConnectEventHandlers();
		}

		public void Refresh()
		{
			LoadList();
		}

		public async Task Create(string name)
		{
			await _tableService.Create(name, ActiveDeck);
			LoadList();
		}

		private void LoadList()
		{
			var listBox = _view.TableList;
			Utilities.ClearListBox(listBox);
			var tables = ActiveDeck.Tables;
			foreach (var table in tables)
			{
				listBox.Add(new TableListRow(table));
			}

			listBox.ShowAll();
		}

		private void ConnectEventHandlers()
		{
			_view.TableList.RowSelected += OnTableSelectionChanged;
		}

		private async void OnTableSelectionChanged(object? o, EventArgs eventArgs)
		{
			var row = (TableListRow) _view.TableList.SelectedRow;
			if (row == null)
			{
				return;
			}

			var table = await _tableService.Find(row.TableId);
			Console.WriteLine("Table " + table.ID);
		}
	}
}