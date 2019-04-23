using System.IO.Pipes;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Model.Impl
{
	public class SimpleCard : Card
	{
		private readonly string _question;
		private readonly string _answer;
		public override string TypeName => "Simple";
		public override bool IsAnswerCorrect(string answer)
		{
			return answer == this._answer; //TODO: levenshtein and 
		}

		public override string GetRepresentativeAnswer()
		{
			return _answer;
		}

		public SimpleCard(string question, string answer)
		{
			_question = question;
			_answer = answer;
		}
	}
}
