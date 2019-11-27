using System.Collections.Generic;

namespace XKS.Model
{
	public class Deck : Entity
	{
		public string Name { get; set; }
		
		public virtual ICollection<Table> Tables { get; private set; } 
			= new List<Table>();
		
		public virtual ICollection<DirectedGraph> Graphs { get; private set; }
			= new List<DirectedGraph>();

		protected Deck()
		{
		}

		public Deck(string name)
		{
			this.Name = name;
		}
	}
}