using XKS.Data.Configuration;
using XKS.Data.Repository.Utility;
using XKS.Model;

namespace XKS.Data.Repository
{
	public class TableRepository : BasicRepository<Table>
	{
		public TableRepository(StandardDbContext dbContext)
			: base(dbContext, dbContext.Tables!)
		{
		}
	}
}