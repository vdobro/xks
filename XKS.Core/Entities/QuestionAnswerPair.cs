using System.Collections.Generic;

namespace XKS.Core.Entities
{
	public sealed class QuestionAnswerPair : Entity
	{
		public string Question { get; set; }
		
		public Answer Answer { get; set; }
	}

	public sealed class Answer
	{
		public AnswerType Type { get; set; } = AnswerType.TEXT;
		
		public string PrimaryValue { get; set; }
		
		public ICollection<string> Alternatives { get; private set; }

		public Answer()
		{
			Alternatives = new HashSet<string>();
		}
	}

	public enum AnswerType
	{
		TEXT,
		NUMERIC
	}
}