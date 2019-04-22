using System.Linq;
using XKS.Domain.Model;

namespace XKS.Data.Model.Adapter
{
	public class DeckModelConverter : IEntityModelConverter<DeckModel, Deck>
	{
		public DeckModel fromDomainToData(Deck domainModel)
		{
			throw new System.NotImplementedException();
		}

		public Deck fromDataToDomain(DeckModel dataModel)
		{
			throw new System.NotImplementedException();
		}
	}
}