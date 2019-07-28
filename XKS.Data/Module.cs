using System;
using System.Reflection;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;
using XKS.Core.Entities;
using XKS.Data.Repositories;
using XKS.Domain.Repository;
using static XKS.Data.ConnectionConfiguration;

namespace XKS.Data
{
	[RegisteredModule("Data module")]
	internal sealed class Module : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		
		public bool InitializedSuccessfully { get; private set; }

		private const string DatabaseName = "xks";
		private readonly Providers Database = Providers.PostgreSQL;

		public void InitializeBeforeStartup(IServiceCollection services)
		{
			services.AddDbContext<StandardDbContext>(options =>
			{
				var connectionString = BuildDatabaseConnectionString(Database, DatabaseName);
				switch (Database)
				{
					case Providers.SQLite:
						options.UseSqlite(connectionString);
						break;
					case Providers.PostgreSQL:
						options.UseNpgsql(connectionString);
						break;
					case Providers.MSSQL:
						options.UseSqlServer(connectionString);
						break;
					case Providers.MySQL:
						options.UseMySQL(connectionString);
						break;
					default:
						throw new ArgumentOutOfRangeException();
				}
			});
			
			services.AddScoped<IEntityRepository<Deck>, DeckRepository>();

			services.BuildServiceProvider().GetService<StandardDbContext>()
				.Database.EnsureCreated();
			
			services.AddAutoMapper(typeof(DataAutoMapperProfile).GetTypeInfo().Assembly);

			InitializedSuccessfully = true;
		}

		public void OnStartup()
		{
			
		}

	}
}
