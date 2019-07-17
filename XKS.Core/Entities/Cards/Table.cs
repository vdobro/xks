using System;
using System.Collections;
using System.Collections.Generic;

namespace XKS.Core.Entities.Cards
{
	public sealed class Table : Card, IEnumerable<QuestionAnswerPair>
	{
		public int RowCount => _rows.Count;

		public int ColumnCount => _rows[0].Count;

		public IReadOnlyCollection<string> RowNames { get; private set; }
		
		public IReadOnlyCollection<string> ColumnNames { get; private set; }
		
		private IList<IList<QuestionAnswerPair>> _rows;
		
		public Table(int rowCount, int columnCount)
		{
			const string exceptionMessage = "Must be greater than 0";
			if (rowCount <= 0)
			{
				throw new ArgumentException(exceptionMessage, nameof(rowCount));
			}

			if (columnCount <= 0)
			{
				throw new ArgumentException(exceptionMessage, nameof(columnCount));
			}
			
			InitTable(rowCount, columnCount);
		}

		public IEnumerator<QuestionAnswerPair> GetEnumerator()
		{
			for (var row = 0; row < RowCount; row++)
			{
				for (var column = 0; column < ColumnCount; column++)
				{
					yield return _rows[row][column];
				}
			}
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return GetEnumerator();
		}
		
		public QuestionAnswerPair this[int row, int column]
		{
			get
			{
				VerifyIndexerArguments(row, column);
				return _rows[row][column];
			}
			set
			{
				VerifyIndexerArguments(row, column);
				_rows[row][column] = value;
			}
		}

		private void InitTable(int rowCount, int columnCount)
		{
			var table = new List<IList<QuestionAnswerPair>>(rowCount);
			for (var i = 0; i < rowCount; i++)
			{
				table.Add(new List<QuestionAnswerPair>(columnCount));
				for (var j = 0; j < columnCount; j++)
				{
					table[i].Add(new QuestionAnswerPair());
				}
			}
			_rows = table;
			var rows = new List<string>(rowCount);
			for (int i = 0; i < RowCount; i++)
			{
				rows.Add($"Row-{i}");
			}
			RowNames = rows;
			
			var columns = new List<string>(rowCount);
			for (int i = 0; i < RowCount; i++)
			{
				columns.Add($"Column-{i}");
			}
			ColumnNames = columns;
		}

		private void VerifyIndexerArguments(int row, int column)
		{
			if (row < 0 || row >= RowCount)
			{
				throw new ArgumentOutOfRangeException(nameof(row));
			}
			if (column < 0 || column >= ColumnCount)
			{
				throw new ArgumentOutOfRangeException(nameof(column));
			}
		}

	}
}