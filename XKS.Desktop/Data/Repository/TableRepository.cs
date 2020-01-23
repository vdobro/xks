using XKS.Data.Configuration;
using XKS.Model;

namespace XKS.Data
{
	public class TableRepository : BasicRepository<Table>
	{
		public TableRepository(StandardDbContext dbContext)
			: base(dbContext, dbContext.Tables!)
		{
		}
	}
}