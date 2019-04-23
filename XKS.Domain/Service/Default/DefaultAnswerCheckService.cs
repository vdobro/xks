using System;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Service.Default
{
	internal sealed class DefaultAnswerCheckService : IAnswerCheckService
	{
		public (string cardAnswers, bool isSuppliedAnswerValid) 
			GetCorrectAnswers(Card card, string suppliedAnswer)
		{
			var correct = card.IsAnswerCorrect(suppliedAnswer);
			return (card.GetRepresentativeAnswer(), correct);
		}
	}
}
