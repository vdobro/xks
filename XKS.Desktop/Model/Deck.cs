using System;
using System.Collections.Generic;

namespace XKS.Model
{
	public class Deck : Entity
	{
		public string Name { get; set; }
		
		public ICollection<Table> Tables { get; private set; } = new List<Table>();
	}
}