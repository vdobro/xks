using System.Collections.Generic;

namespace XKS.Data.Backing
{
	public class Card : Common.Entities.Entity//, ICustomMappingOwner
	{
		public virtual ICollection<CardTag> TagLinks { get; private set; }
		
		public virtual Deck Deck { get; private set; }

		public Card()
		{
			TagLinks = new HashSet<CardTag>();
		}
/*
		public void InitializeMappings(Profile configuration)
		{
			configuration.CreateMap<Data.Backing.Card, XKS.Common.Entities.Card>()
				.ForMember(x => x.Tags, opt => 
					opt.MapFrom(p => p.TagLinks.Select(tl => tl.Tag)));
		}*/
	}
}