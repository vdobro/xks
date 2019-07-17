using System.Reflection;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;
using XKS.Core.Entities;
using XKS.Data.Repositories;
using XKS.Domain.Repository;

namespace XKS.Data
{
	[RegisteredModule("Data module")]
	internal sealed class Module : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		
		public bool InitializedSuccessfully { get; private set; }
		
		public void InitializeBeforeStartup(IServiceCollection services)
		{
			services.AddDbContext<StandardDbContext>(options =>
			{
				options.UseNpgsql(ConnectionConfiguration
					.BuildDatabaseConnectionString("xks"));
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
