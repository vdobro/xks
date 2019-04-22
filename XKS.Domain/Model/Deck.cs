using System;
using System.Collections;
using System.Collections.Generic;

namespace XKS.Domain.Model
{
	public sealed class Deck : ModelBase
	{
		public string Name { get; }

		public IEnumerable<Card> Cards { get; }

		public Deck(string name)
		{
			Name = name;
			Cards = new List<Card>();
		}

		public Deck(string name, IEnumerable<Card> cards) : this(name)
		{
			this.Cards = cards;
		}
	}
}