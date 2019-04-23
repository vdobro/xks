using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using XKS.Domain.Converter;
using XKS.Domain.Model.Base;
using XKS.Domain.Service;
using XKS.Domain.View;

namespace XKS.Domain.UseCase
{
	public sealed class AnswerCardUseCase : IUseCase<CardCheckerResponse, SuppliedAnswer>
	{
		private readonly IModelMapper<Card, CardView> _cardMapper;
		private readonly IAnswerCheckService _answerCheckService;
		private readonly ICardSupplyService _cardSupplyService;

		public AnswerCardUseCase(IAnswerCheckService answerCheckService,
			IModelMapper<Card, CardView> cardMapper,
			ICardSupplyService cardSupplyService)
		{
			_answerCheckService = answerCheckService;
			_cardMapper = cardMapper;
			_cardSupplyService = cardSupplyService;
		}

		public CardCheckerResponse Execute(SuppliedAnswer parameters)
		{
			var now = DateTime.Now;
			var timeNeeded = now - parameters.CardView.Timestamp;
			var card = _cardMapper.ToModel(parameters.CardView);
			var answer = _answerCheckService.GetCorrectAnswers(card,
				parameters.UserInput);

			return new CardCheckerResponse(parameters, answer.isSuppliedAnswerValid,
				timeNeeded);
		}
	}
}
