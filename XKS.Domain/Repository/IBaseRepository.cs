using System;
using XKS.Domain.Model;

namespace XKS.Domain.Repository
{
	public interface IBaseRepository<T> where T : ModelBase
	{
		T find(Guid id);

		T add(T entity);

		T update(T entity);

		T delete(T entity);
	}
}
