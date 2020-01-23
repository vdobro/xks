using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using XKS.Model;

namespace XKS.Data
{
	public abstract class BasicRepository<T> : IEntityRepository<T> where T : Entity
	{
		private readonly DbContext _dbContext;
		private readonly DbSet<T> _backendCollection;

		protected BasicRepository(DbContext dbContext, DbSet<T> backendCollection)
		{
			_dbContext = dbContext;
			_backendCollection = backendCollection;
		}
		
		public async Task<IEnumerable<T>> GetAll() =>  await _backendCollection.ToListAsync();

		public async Task<T> Find(Guid id) => await _backendCollection.FindAsync(id);

		public async Task<T> Save(T newEntity)
		{
			var existingEntity = await Find(newEntity.ID);
			if (existingEntity != null)
			{
				await _dbContext.SaveChangesAsync();
				return existingEntity;
			}

			await _backendCollection.AddAsync(newEntity);
			await _dbContext.SaveChangesAsync();
			return newEntity;
		}

		public async Task Delete(T entity)
		{
			_backendCollection.Remove(entity);
			await _dbContext.SaveChangesAsync();
		}
	}
}