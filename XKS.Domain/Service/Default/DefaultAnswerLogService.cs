using System;
using XKS.Domain.Model;
using XKS.Domain.Model.Base;
using XKS.Domain.Repository;

namespace XKS.Domain.Service.Default
{
	internal sealed class DefaultAnswerLogService : IAnswerLogService
	{
		private readonly IBaseRepository<LoggedAnswer> _answerLogRepository;

		public DefaultAnswerLogService(IBaseRepository<LoggedAnswer> answerLogRepository)
		{
			_answerLogRepository = answerLogRepository;
		}
		
		public void LogAnswer(string actualAnswer, bool correct, Card card, TimeSpan timeTaken)
		{
			_answerLogRepository.Create(new LoggedAnswer(actualAnswer, correct, card, timeTaken.Seconds));
		}
	}
}
