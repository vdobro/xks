namespace XKS.Model
{
	public class ColumnDefinition : Entity
	{
		public string?      Title { get; set; }
		public ColumnTypes? Type  { get; set; }
		
		public virtual Table? Table { get; private set; }

		public ColumnDefinition(Table table, string title, ColumnTypes type)
		{
			this.Table = table;
			this.Title = title;
			this.Type = type;
		}
		
		protected ColumnDefinition()
		{
		}
	}
}