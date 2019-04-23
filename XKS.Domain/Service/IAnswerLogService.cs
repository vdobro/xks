using System;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Service
{
	public interface IAnswerLogService
	{
		void LogAnswer(string actualAnswer, bool correct, Card card, TimeSpan timeTaken);
	}
}
