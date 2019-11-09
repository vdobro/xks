namespace XKS.Core.View
{
	public sealed class FinalCardAnswer
	{
		public CardCheckerResponse CheckerResponse { get; }
		
		public bool ForceAcceptAnswer { get; }
		
		public FinalCardAnswer(CardCheckerResponse checkerResponse, bool forceAcceptAnswer)
		{
			CheckerResponse = checkerResponse;
			ForceAcceptAnswer = forceAcceptAnswer;
		}
	}
}
