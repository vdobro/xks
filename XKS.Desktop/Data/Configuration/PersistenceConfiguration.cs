using System;
using Microsoft.EntityFrameworkCore;
using static XKS.Data.Configuration.ConnectionConfiguration;
using static XKS.Data.Configuration.ConnectionConfiguration.Providers;

namespace XKS.Data.Configuration
{
	public static class PersistenceConfiguration
	{
		private const           string    DatabaseName = "xks";
		private static readonly Providers Database     = MariaDB;

		public static DbContextOptions<StandardDbContext> ConfigDbContextOptions(
			DbContextOptionsBuilder<StandardDbContext> builder)
		{
			builder.UseLazyLoadingProxies();
			var connectionString = BuildDatabaseConnectionString(Database, DatabaseName);
			switch (Database)
			{
				case SQLite:
					builder.UseSqlite(connectionString);
					break;
				case PostgreSQL:
					builder.UseNpgsql(connectionString);
					break;
				case MySQL:
				case MariaDB:
					builder.UseMySql(connectionString);
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}

			return builder.Options;
		}
	}
}