namespace XKS.Model
{
	public class ColumnDefinition : Entity
	{
		public string      Title { get; set; }
		public ColumnTypes Type  { get; set; }

		protected ColumnDefinition()
		{
		}
	}
}