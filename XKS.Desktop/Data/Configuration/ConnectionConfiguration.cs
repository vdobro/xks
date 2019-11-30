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
		}

		private const string LocalDbFolder = ".xks";

		private static readonly string Host     = "localhost";
		private static readonly string Username = "vd";
		private static readonly string Password = "vd";

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
					return $"Host={Host};Database={dbName};Username={Username};Password={Password}";
				default:
					throw new ArgumentOutOfRangeException(nameof(provider), provider, null);
			}

			throw new NotImplementedException("Database type not supported yet");
		}
	}
}