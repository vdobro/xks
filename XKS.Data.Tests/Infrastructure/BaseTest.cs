using AutoMapper;
using NUnit.Framework;

namespace XKS.Data.Tests.Infrastructure
{
	public abstract class BaseTest
	{
		protected readonly IMapper Mapper;
		protected readonly StandardDbContext DbContext;

		private readonly BaseTestFixture fixture = new BaseTestFixture();
		
		protected BaseTest()
		{
			Mapper = fixture.Mapper;
			DbContext = fixture.Context;
		}

		[TearDown]
		public void CleanUpFixture()
		{
			fixture.Dispose();
		}
	}
}