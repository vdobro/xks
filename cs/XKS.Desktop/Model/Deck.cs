using System.Collections.Generic;

namespace XKS.Model
{
	public class Deck : Entity
	{
		public string? Name { get; set; }

		public virtual ICollection<Table> Tables { get; }
			= new List<Table>();

		public virtual ICollection<DirectedGraph> Graphs { get; }
			= new List<DirectedGraph>();

		protected Deck()
		{
		}

		public Deck(string name)
		{
			Name = name;
		}
	}
}