using XKS.Domain.View;

namespace XKS.Domain.Service
{
	public interface ICardSupplyService
	{
		CardView GetNextCard();
	}
}
