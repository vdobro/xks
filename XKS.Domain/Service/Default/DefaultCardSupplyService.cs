using XKS.Domain.Model.Base;
using XKS.Domain.Repository;
using XKS.Domain.View;

namespace XKS.Domain.Service.Default
{
	internal sealed class DefaultCardSupplyService : ICardSupplyService
	{
		private readonly IAnswerLogService _logService;

		private readonly IBaseRepository<Card> _cardRepository;

		public DefaultCardSupplyService(IAnswerLogService logService, 
			IBaseRepository<Card> cardRepository)
		{
			_logService = logService;
			_cardRepository = cardRepository;
		}
		
		public CardView GetNextCard()
		{
			throw new System.NotImplementedException();
		}
	}
}
