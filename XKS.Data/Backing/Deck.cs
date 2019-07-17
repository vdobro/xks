using System;
using System.Collections.Generic;
using XKS.Core.Infrastructure;

namespace XKS.Data.Backing
{
	public class Deck : XKS.Core.Entities.Entity, IMapFrom<XKS.Core.Entities.Deck>, IEquatable<Deck>
	{
		public override int GetHashCode()
		{
			return (Name != null ? Name.GetHashCode() : 0);
		}

		public string Name { get; set; }

		public virtual ICollection<Card> Cards { get; private set; }

		public Deck()
		{
			Cards = new HashSet<Card>();
		}

		public override bool Equals(object obj)
		{
			if (ReferenceEquals(this, obj)) return true;
			if (!(obj is Deck)) return false;
			var objCast = (Deck) obj;
			return Equals(objCast);
		}

		public static bool operator ==(Deck left, Deck right)
		{
			return Equals(left, right);
		}

		public static bool operator !=(Deck left, Deck right)
		{
			return !Equals(left, right);
		}

		public bool Equals(Deck obj)
		{
			return this.ID == obj.ID
			       && this.Name == obj.Name;
		}
	}
}