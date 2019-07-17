namespace XKS.Data
{
	public static class ConnectionConfiguration
	{
		public static string BuildDatabaseConnectionString(string dbName)
		{
			return $"Host=localhost;Database={dbName};Username=postgres;Password=sw";
		}
	}
}