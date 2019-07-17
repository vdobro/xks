using System.Reflection;
using AutoMapper;

namespace XKS.Core.Infrastructure
{
	public class DefaultAutoMapperProfile : Profile
	{
		public DefaultAutoMapperProfile()
		{
			var assemblies = AssemblyUtilities.LoadedModuleAssemblies;
			foreach (var assembly in assemblies)
			{
				LoadStandardMappings(assembly);
				LoadCustomMappings(assembly);
			}
		}

		private void LoadStandardMappings(Assembly assembly)
		{
			var maps = AutomapperHelper.LoadStandard(assembly);
			foreach (var map in maps)
			{
				this.CreateMap(map.Source, map.Destination).ReverseMap();
			}
		}

		private void LoadCustomMappings(Assembly assembly)
		{
			var maps = AutomapperHelper.LoadCustom(assembly);

			foreach (var map in maps)
			{
				map.InitializeMappings(this);
			}
		}
	}
}