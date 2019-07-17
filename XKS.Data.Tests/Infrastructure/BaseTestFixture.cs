using System;
using AutoMapper;

namespace XKS.Data.Tests.Infrastructure
{
	public sealed class BaseTestFixture : IDisposable
	{
		public readonly StandardDbContext Context;
		public readonly IMapper Mapper;

		public BaseTestFixture()
		{
			Context = DatabaseContextFactory.Create();
			Mapper = MapperFactory.Initialize();

			Mapper.ConfigurationProvider.CompileMappings();
		}
		
		public void Dispose()
		{
			DatabaseContextFactory.Destroy(Context);
		}
	}
}