using System;
using System.IO;
using static System.Environment;
using static System.Environment.SpecialFolder;

namespace XKS.Data.Configuration
{
	public static class ConnectionConfiguration
	{
		public enum Providers
		{
			SQLite,
			PostgreSQL,
			MySQL,
			MariaDB,
		}

		private const string LocalDbFolder = ".xks";

		private static readonly string Host     = "localhost";
		private static readonly string Port     = "32783";
		private static readonly string Username = "root";
		private static readonly string Password = "sa";

		public static string BuildDatabaseConnectionString(Providers provider, string dbName)
		{
			switch (provider)
			{
				case Providers.SQLite:
					var appPath = Path.Combine(GetFolderPath(MyDocuments), LocalDbFolder);
					if (!Directory.Exists(appPath))
					{
						Directory.CreateDirectory(appPath);
					}

					var path = Path.Combine(appPath, dbName + ".db");
					return $"Data Source={path}";
				case Providers.PostgreSQL:
					return $"Host={Host};Port={Port};Database={dbName};Username={Username};Password={Password}";
				case Providers.MySQL:
				case Providers.MariaDB:
					return $"Server={Host};Port={Port};User Id={Username};Password={Password};Database={dbName}";
				default:
					throw new ArgumentOutOfRangeException(nameof(provider), "Unsupported database type");
			}
		}
	}
}