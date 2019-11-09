using System;
using AutoMapper;
using XKS.Common.Infrastructure;

namespace XKS.Data.Tests.Infrastructure
{
	public static class MapperFactory
	{
		public static IMapper Initialize()
		{
			var expr = new Action<IMapperConfigurationExpression>(
				(mc) =>
				{
					mc.AddProfile(new DefaultAutoMapperProfile());
				});
			var conf = new MapperConfiguration(expr);
			
			return conf.CreateMapper();
		}
	}
}