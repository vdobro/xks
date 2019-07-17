using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using XKS.Core.Infrastructure;

namespace XKS.Data.Backing
{
	public class Tag: Core.Entities.Entity, ICustomMappingOwner
	{
		public string Name { get; set; }
		
		public virtual ICollection<CardTag> CardLinks { get; private set; }

		public Tag()
		{
			this.CardLinks = new HashSet<CardTag>();
		}

		public void InitializeMappings(Profile configuration)
		{
			//TODO: it should not work without a StackOverflowException
			configuration.CreateMap<Tag, XKS.Core.Entities.Tag>()
				.ForMember(x => x.Cards, opt => 
					opt.MapFrom(p => p.CardLinks.Select(tl => tl.Card)));
		}
	}
}