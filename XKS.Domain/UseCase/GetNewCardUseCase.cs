using XKS.Domain.Converter;
using XKS.Domain.Model.Base;
using XKS.Domain.Service;
using XKS.Domain.View;

namespace XKS.Domain.UseCase
{
	public sealed class GetNewCardUseCase : IUseCase<CardView, FinalCardAnswer>
	{
		private readonly IModelMapper<Card, CardView> _cardMapper;
		private readonly IAnswerLogService _answerLogService;
		private readonly ICardSupplyService _cardSupplyService;

		public GetNewCardUseCase(ICardSupplyService cardSupplyService,
			IModelMapper<Card, CardView> cardMapper, 
			IAnswerLogService answerLogService)
		{
			_cardSupplyService = cardSupplyService;
			_cardMapper = cardMapper;
			_answerLogService = answerLogService;
		}

		public CardView Execute(FinalCardAnswer parameters)
		{
			if (parameters == null) 
				return _cardSupplyService.GetNextCard();
			
			var answer = parameters.CheckerResponse.Answer.UserInput;
			var correct = parameters.ForceAcceptAnswer
			              || parameters.CheckerResponse.AnswerAccepted;
			var card = _cardMapper.ToModel(parameters.CheckerResponse.Answer.CardView);
			var time = parameters.CheckerResponse.TimeTaken;
			_answerLogService.LogAnswer(answer, correct, card, time);

			return _cardSupplyService.GetNextCard();
		}
	}
}
