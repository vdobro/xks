using System;
using System.Reflection;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;
using XKS.Common.Configuration;
using XKS.Common.Entities;
using XKS.Core.Repository;
using XKS.Data.Repositories;

using static XKS.Data.ConnectionConfiguration;

namespace XKS.Data
{
	[RegisteredModule]
	internal sealed class Module : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		
		public bool InitializedSuccessfully { get; private set; }

		private const string DatabaseName = "xks";
		private static readonly Providers Database = Providers.PostgreSQL;

		private static DbContextOptions<StandardDbContext> ConfigDbContextOptions(DbContextOptionsBuilder<StandardDbContext> builder)
		{
			var connectionString = BuildDatabaseConnectionString(Database, DatabaseName);
			switch (Database)
			{
				case Providers.SQLite:
					builder.UseSqlite(connectionString);
					break;
				case Providers.PostgreSQL:
					builder.UseNpgsql(connectionString);
					break;
				case Providers.MSSQL:
					builder.UseSqlServer(connectionString);
					break;
				case Providers.MySQL:
					builder.UseMySQL(connectionString);
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}

			return builder.Options;
		}
		
		public StructureMap.Registry InitializeBeforeStartup()
		{
			// services.AddScoped<IEntityRepository<Deck>, DeckRepository>();

			// services.AddAutoMapper(typeof(DataAutoMapperProfile).GetTypeInfo().Assembly);

			InitializedSuccessfully = true;

			return new Module.Registry(Database);
		}

		public void OnStartup(Container container)
		{
			
		}
		
		class Registry : StructureMap.Registry
		{
			private Providers databaseProvider;
			
			public Registry(Providers databaseProvider)
			{
				this.databaseProvider = databaseProvider;
				
				For<DbContextOptions<StandardDbContext>>()
				   .Use(() => ConfigDbContextOptions(new DbContextOptionsBuilder<StandardDbContext>()));
				For<DbContext>().Use<StandardDbContext>();

				For<IEntityRepository<Deck>>().Use<DeckRepository>();
			}
		}
	}
	
}
