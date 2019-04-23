namespace XKS.Domain.Model.Base
{
	public abstract class Card : ModelBase
	{
		public abstract string TypeName { get; }

		public abstract bool IsAnswerCorrect(string answer);

		public abstract string GetRepresentativeAnswer();
	}
}
