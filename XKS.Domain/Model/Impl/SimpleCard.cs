using System.IO.Pipes;

namespace XKS.Domain.Model.Impl
{
	public class SimpleCard : Card
	{
		public override string TypeName => "Simple";

		public SimpleCard(string question, string answer)
		{
		}
	}
}