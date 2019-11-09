using System;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;
using XKS.Common.Configuration;
using XKS.Core.Service;
using XKS.Core.Service.Implementation;

namespace XKS.Core.Configuration
{
    [RegisteredModule]
    // ReSharper disable once UnusedMember.Global
    internal sealed class Module : IApplicationModule
    {
        public string DisplayName => GetType().AssemblyQualifiedName;
        public bool InitializedSuccessfully { get; private set; }

        public Registry InitializeBeforeStartup()
        {
            try
            {
                // space left for any future extension to initialization
                InitializedSuccessfully = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                InitializedSuccessfully = false;
            }
            return new ModuleRegistry();
        }

        public void OnStartup(Container container)
        {
			
        }

        class ModuleRegistry : Registry
        {
            public ModuleRegistry()
            {
                For<IDeckService>().Use<DeckService>();
            }
        }
    }
}