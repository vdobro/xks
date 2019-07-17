using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using XKS.Core.Infrastructure;

namespace XKS.Data.Backing
{
	public class Card : Core.Entities.Entity, ICustomMappingOwner
	{
		public virtual ICollection<CardTag> TagLinks { get; private set; }

		public Card()
		{
			TagLinks = new HashSet<CardTag>();
		}

		public void InitializeMappings(Profile configuration)
		{
			configuration.CreateMap<Data.Backing.Card, XKS.Core.Entities.Card>()
				.ForMember(x => x.Tags, opt => 
					opt.MapFrom(p => p.TagLinks.Select(tl => tl.Tag)));
		}
	}
}