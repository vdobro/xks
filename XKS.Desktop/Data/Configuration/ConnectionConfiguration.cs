using System;
using System.IO;
using static System.Environment;
using static System.Environment.SpecialFolder;

namespace XKS.Data.Configuration
{
	public static class ConnectionConfiguration
	{
		private const string LocalDbFolder = ".xks";
		
		private static string Host = "localhost";
		private static string Username = "vd";
		private static string Password = "vd";
		
		public static string BuildDatabaseConnectionString(Providers provider, string dbName)
		{
			switch (provider)
			{
				case Providers.SQLite:
					var appPath = Path.Combine(GetFolderPath(MyDocuments), 
						LocalDbFolder);
					if (!Directory.Exists(appPath)) Directory.CreateDirectory(appPath);
					var path = Path.Combine(appPath, dbName + ".db");
					return $"Data Source={path}";
				case Providers.PostgreSQL:
					return $"Host={Host};Database={dbName};Username={Username};Password={Password}";
				case Providers.MSSQL:
					break;
				case Providers.MySQL:
					break;
				default:
					throw new ArgumentOutOfRangeException(nameof(provider), provider, null);
			}
			throw new NotImplementedException("Database type not supported yet");
		}
		
		public enum Providers
		{
			SQLite,
			PostgreSQL,
			MSSQL,
			MySQL,
		}
	}
}