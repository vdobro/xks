using System;
using System.Collections.Generic;
using XKS.Common.Infrastructure;

namespace XKS.Data.Backing
{
	public class Deck : XKS.Common.Entities.Entity,
	                    //IMapFrom<XKS.Common.Entities.Deck>, 
	                    IEquatable<Deck>
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
			if (obj is null) return false;
			return this.ID == obj.ID
			    && this.Name == obj.Name;
		}

		public static Func<Deck, Common.Entities.Deck> Projection =
			(x) => new Common.Entities.Deck()
			{
				Name = x.Name,
				Cards = { },
			};
	}
}