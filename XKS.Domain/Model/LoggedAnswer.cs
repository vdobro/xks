using XKS.Domain.Model.Base;

namespace XKS.Domain.Model
{
	public sealed class LoggedAnswer : ModelBase
	{
		public string Answer { get; }
		public bool Correct { get; }
		public Card Card { get; }
		public int TimeTaken { get; }

		public LoggedAnswer(string answer, bool correct, Card card, int timeTaken)
		{
			Answer = answer;
			Correct = correct;
			Card = card;
			TimeTaken = timeTaken;
		}
	}
}
