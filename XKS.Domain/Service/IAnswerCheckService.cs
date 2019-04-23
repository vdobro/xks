using XKS.Domain.Model;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Service
{
	public interface IAnswerCheckService
	{
		(string cardAnswers, bool isSuppliedAnswerValid) 
			GetCorrectAnswers(Card card, string suppliedAnswer);
	}
}
