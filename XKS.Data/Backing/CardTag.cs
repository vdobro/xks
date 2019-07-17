using System;

namespace XKS.Data.Backing
{
	public class CardTag
	{
		public Guid CardID { get; set; }
		public Card Card { get; set; }
		
		public Guid TagID { get; set; }
		public Tag Tag { get; set; }
	}
}