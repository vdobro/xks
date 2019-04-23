using XKS.Domain.Model;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Converter
{
	public interface IModelMapper<TModel, TDto>
		where TModel : ModelBase
	{
		TDto ToDto(TModel model);

		TModel ToModel(TDto dto);
	}
}
