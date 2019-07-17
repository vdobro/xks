using System;
using System.Linq;
using System.Threading.Tasks;
using XKS.Core.Entities;

namespace XKS.Domain.Repository
{
	public interface IEntityRepository<T> where T : Entity
	{
		IQueryable<Deck> GetAll();
		
		Task<T> Find(Guid id);

		Task<T> Save(T entity);

		Task Delete(T entity);
	}
}