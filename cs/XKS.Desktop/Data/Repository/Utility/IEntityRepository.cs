using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XKS.Model;

namespace XKS.Data.Repository.Utility
{
	public interface IEntityRepository<T> where T : Entity
	{
		Task<IEnumerable<T>> GetAll();

		Task<T> Find(Guid id);

		Task<T> Save(T entity);

		Task Delete(T entity);
	}
}