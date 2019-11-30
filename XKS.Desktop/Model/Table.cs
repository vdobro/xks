using System.Collections.Generic;

namespace XKS.Model
{
	public class Table : Entity
	{
		public string? Title { get; set; }
		
		public virtual Deck? Deck { get; private set; }

		public virtual ICollection<ColumnDefinition> Columns { get; }
			= new List<ColumnDefinition>();

		public virtual ICollection<TableRow> Rows { get; }
			= new List<TableRow>();

		public Table(string title, Deck deck)
		{
			this.Title = title;
			this.Deck = deck;
		}
		
		protected Table()
		{
		}
	}
}