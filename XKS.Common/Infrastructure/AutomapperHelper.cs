using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using AutoMapper;

namespace XKS.Common.Infrastructure
{
	public class TypeMap
	{
		public Type Source { get; set; }
		public Type Destination { get; set; }
	}

	public class AutomapperHelper
	{
		public static IEnumerable<TypeMap> LoadStandard(Assembly assembly)
		{
			var types = assembly.GetExportedTypes();
			var result = new List<TypeMap>();
			foreach (var type in types)
			{
				var interfaces = type.GetInterfaces();
				foreach (var interfaceType in interfaces)
				{
					if (!interfaceType.IsGenericType
					    || interfaceType.GetGenericTypeDefinition() != typeof(IMapFrom<>) 
					    || type.IsAbstract 
					    || type.IsInterface) continue;
					var map = new TypeMap
					{
						Source = interfaceType.GetGenericArguments().First(),
						Destination = type
					};
					result.Add(map);
				}
			}

			return result;
		}

		public static IEnumerable<ICustomMappingOwner> LoadCustom(Assembly assembly)
		{
			var managedTypes = assembly.ExportedTypes;
			var maps = (
					from type in managedTypes
					from instance in type.GetInterfaces()
					where 
						typeof(ICustomMappingOwner).IsAssignableFrom(type)
						&& !type.IsAbstract
						&& !type.IsInterface
					select 
						(ICustomMappingOwner)Activator.CreateInstance(type))
				.ToList();
			return maps;
		}
	}

	public interface IMapFrom<TEntity>
	{
	}

	public interface ICustomMappingOwner
	{
		void InitializeMappings(Profile configuration);
	}
}