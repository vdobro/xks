using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using Cairo;
using XKS.Domain.Configuration;
using Path = System.IO.Path;

namespace XKS.Launcher
{
	public static class AssemblyUtilities
	{
		private const string LibraryFilePattern = "XKS.*.dll";
		private static readonly Type ModuleAttributeType = 
			typeof(RegisteredModule);
		
		private static readonly ICollection<Type> ModuleTypes = new List<Type>();

		private static readonly ICollection<Assembly> LoadedAssemblies
			= GetRelevantAssemblies();

		private static readonly Predicate<Type> criteria =
			type => Attribute.IsDefined(type, ModuleAttributeType);
		
		public static IEnumerable<Type> RegisteredModuleTypes
		{
			get
			{
				var moduleTypes = LoadedAssemblies.SelectMany(assembly
					=> assembly.GetTypes()).Where(x => criteria(x)).ToList();
				
				foreach (var module in moduleTypes)
				{
					if (ModuleTypes.Contains(module))
						throw new Exception("Module already registered");
					ModuleTypes.Add(module);	
				}

				return ModuleTypes;
			}
		}

		private static ICollection<Assembly> GetRelevantAssemblies()
		{
			var loadedAssemblies = AppDomain.CurrentDomain.GetAssemblies()
				.Where(assembly => assembly.FullName.StartsWith("XKS")).ToList();
			
			string path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

			var files = Directory.GetFiles(path, LibraryFilePattern);
			
			var assemblies = files.Select(Assembly.LoadFile)
				.Where(x => !loadedAssemblies
					.Exists(y => y.FullName == x.FullName)).ToList();
			
			assemblies.AddRange(loadedAssemblies);
			return assemblies;
		}
	}
}
