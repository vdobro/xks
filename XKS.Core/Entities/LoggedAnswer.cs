using System;

namespace XKS.Core.Entities
{
	public sealed class LoggedAnswer
	{
		public QuestionAnswerPair Source { get; set; }
		
		public bool Correct { get; set; }

		public TimeSpan TimeTaken { get; set; }

		public LoggedAnswer()
		{
			
		}
	}
}