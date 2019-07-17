using Microsoft.EntityFrameworkCore;

namespace XKS.Data.Tests.Infrastructure
{
	public static class DatabaseContextFactory
	{
		public static StandardDbContext Create()
		{
			var options = new DbContextOptionsBuilder<StandardDbContext>()
				.UseNpgsql(ConnectionConfiguration
					.BuildDatabaseConnectionString("xks_test"))
				.Options;
			var context = new StandardDbContext(options);

			context.Database.EnsureDeleted();
			context.Database.EnsureCreated();

			return context;
		}

		public static void Destroy(StandardDbContext context)
		{
			//context.Database.EnsureDeleted();
			
			context.Dispose();
		}
	}
}