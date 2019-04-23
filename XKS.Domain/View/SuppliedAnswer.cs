namespace XKS.Domain.View
{
	public sealed class SuppliedAnswer
	{
		public CardView CardView { get; }

		public string UserInput { get; }

		public SuppliedAnswer(CardView cardView, string userInput)
		{
			CardView = cardView;
			UserInput = userInput;
		}
	}
}
