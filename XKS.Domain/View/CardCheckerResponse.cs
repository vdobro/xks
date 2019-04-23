using System;

namespace XKS.Domain.View
{
	public sealed class CardCheckerResponse
	{
		public SuppliedAnswer Answer { get; }
		
		public bool AnswerAccepted { get; }
		
		public TimeSpan TimeTaken { get; }
		
		public CardCheckerResponse(SuppliedAnswer answer,
			bool answerAccepted, TimeSpan timeTaken)
		{
			Answer = answer;
			AnswerAccepted = answerAccepted;
			TimeTaken = timeTaken;
		}
	}
}
