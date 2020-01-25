using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using static System.Environment;
using static System.Environment.SpecialFolder;
using static XKS.Data.Configuration.DatabaseProvider;

namespace XKS.Data.Configuration
{
	public static class ConnectionConfiguration
	{
		private const string LocalDbFolder = ".xks";

		private static IConfiguration Configuration => MainApplication.Configuration;

		private static DatabaseProvider DatabaseProvider =>
			GetConfigurationKey("Type") switch
			{
				"mariadb" => MariaDB,
				"mysql" => MariaDB,
				"postgres" => PostgreSQL,
				"sqlite" => SQLite,
				_ => throw new ArgumentException("Invalid database provider")
			};

		private static string Host     => GetConfigurationKey("Host");
		private static string Port     => GetConfigurationKey("Port");
		private static string Name     => GetConfigurationKey("Name");
		private static string Username => GetConfigurationKey("Username");
		private static string Password => GetConfigurationKey("Password");

		private static string BuildDatabaseConnectionString()
		{
			switch (DatabaseProvider)
			{
				case SQLite:
					var appPath = Path.Combine(GetFolderPath(MyDocuments), LocalDbFolder);
					if (!Directory.Exists(appPath))
					{
						Directory.CreateDirectory(appPath);
					}

					var path = Path.Combine(appPath, Name + ".db");
					return $"Data Source={path}";
				case PostgreSQL:
					return $"Host={Host};Port={Port};Database={Name};Username={Username};Password={Password}";
				case MySQL:
				case MariaDB:
					return $"Server={Host};Port={Port};User Id={Username};Password={Password};Database={Name}";
				default:
					throw new ArgumentOutOfRangeException(nameof(DatabaseProvider), "Unsupported database type");
			}
		}

		public static DbContextOptions<StandardDbContext> ConfigDbContextOptions(
			DbContextOptionsBuilder<StandardDbContext> builder)
		{
			builder.UseLazyLoadingProxies();
			var connectionString = BuildDatabaseConnectionString();
			switch (DatabaseProvider)
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

		private static string GetConfigurationKey(string name) =>
			Configuration.GetSection("Database").GetValue<string>(name);
	}
}