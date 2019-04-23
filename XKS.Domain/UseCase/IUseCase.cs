using System.Threading.Tasks;

namespace XKS.Domain.UseCase
{
	public interface IUseCase<out TResult, in TParam>
	{
		TResult Execute(TParam parameters);
	}
}
