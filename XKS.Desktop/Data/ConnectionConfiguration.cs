using System;
using System.IO;
using static System.Environment;
using static System.Environment.SpecialFolder;

namespace XKS.Data
{
	public static class ConnectionConfiguration
	{
		private const string LocalDbFolder = "XKS";
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
					return $"Host=localhost;Database={dbName};Username=vd;Password=vd";
				case Providers.MSSQL:
					break;
				case Providers.MySQL:
					break;
				default:
					throw new ArgumentOutOfRangeException(nameof(provider), provider, null);
			}
			throw new NotImplementedException();
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