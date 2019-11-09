using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XKS.Common.Entities;

namespace XKS.Core.Repository
{
	public interface IEntityRepository<T> where T : Entity
	{
		Task<IEnumerable<Deck>> GetAll();
		
		Task<T> Find(Guid id);

		Task<T> Save(T entity);

		Task Delete(T entity);
	}
}