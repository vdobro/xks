using System;
using XKS.Domain.Model;
using XKS.Domain.Model.Base;

namespace XKS.Domain.Repository
{
	public interface IBaseRepository<T> where T : ModelBase
	{
		T Create(T entity);

		T Read(Guid id);
		
		T Update(T entity);

		T Delete(T entity);
	}
}
