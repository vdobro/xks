namespace XKS.Model
{
	public class ColumnDefinition : Entity
	{
		public string?      Title { get; set; }
		public ColumnTypes? Type  { get; set; }

		public virtual Table? Table { get; }

		public ColumnDefinition(Table table, string title, ColumnTypes type)
		{
			Table = table;
			Title = title;
			Type = type;
		}

		protected ColumnDefinition()
		{
		}
	}
}