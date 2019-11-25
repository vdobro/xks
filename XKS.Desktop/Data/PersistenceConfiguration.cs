using System;
using Microsoft.EntityFrameworkCore;
using static XKS.Data.ConnectionConfiguration;
using static XKS.Data.ConnectionConfiguration.Providers;

namespace XKS.Data
{
	public static class PersistenceConfiguration
	{
		private const           string    DatabaseName = "xks";
		private static readonly Providers Database     = PostgreSQL;
		
		public static DbContextOptions<StandardDbContext> ConfigDbContextOptions(
			DbContextOptionsBuilder<StandardDbContext> builder)
		{
			var connectionString = BuildDatabaseConnectionString(Database, DatabaseName);
			switch (Database)
			{
				case SQLite:
					builder.UseSqlite(connectionString);
					break;
				case PostgreSQL:
					builder.UseNpgsql(connectionString);
					break;
				case MSSQL:
					builder.UseSqlServer(connectionString);
					break;
				case MySQL:
					builder.UseMySQL(connectionString);
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}
			return builder.Options;
		}
	}
}