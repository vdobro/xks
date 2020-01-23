using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XKS.Data;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public sealed class TableService : ITableService
	{
		private readonly IEntityRepository<Deck> _deckRepository;
		private readonly IEntityRepository<Table> _tableRepository;

		public TableService(IEntityRepository<Table> tableRepository, 
		                    IEntityRepository<Deck> deckRepository)
		{
			_tableRepository = tableRepository;
			_deckRepository = deckRepository;
		}

		public Task<Table> Find(Guid id) => _tableRepository.Find(id);

		public async Task<Table> Create(string title, Deck deck)
		{
			var table = new Table(title, deck);
			deck.Tables.Add(table);
			await _deckRepository.Save(deck);
			return await _tableRepository.Find(table.ID);
		}

		public async Task<ColumnDefinition> AddColumn(Table table, string name, ColumnTypes type)
		{
			var column = new ColumnDefinition(table, name, type);
			table.Columns.Add(column);
			await _tableRepository.Save(table);
			return column;
		}

		public async Task AddRow(Table table)
		{
			var row = new TableRow();
			table.Rows.Add(row);
			await _tableRepository.Save(table);
		}
	}
}