using System;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;
using XKS.Common.Configuration;

namespace XKS.CLI.Configuration
{
    [RegisteredModule]
    public class Module : IApplicationModule
    {
        public string DisplayName => GetType().AssemblyQualifiedName;
        public bool InitializedSuccessfully { get; private set; }

        public IServiceCollection InitializeBeforeStartup(IServiceCollection services)
        {
            throw new System.NotImplementedException();
        }

        public Registry InitializeBeforeStartup()
        {
            throw new NotImplementedException();
        }

        public void OnStartup(Container container)
        {
            throw new System.NotImplementedException();
        }
    }
}