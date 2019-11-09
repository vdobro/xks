using System;

namespace XKS.Common.Entities
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