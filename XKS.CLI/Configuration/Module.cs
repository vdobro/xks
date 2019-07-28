using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;

namespace XKS.CLI.Configuration
{
    [RegisteredModule("CLI client module")]
    public class Module : IApplicationModule
    {
        public string DisplayName => GetType().AssemblyQualifiedName;
        public bool InitializedSuccessfully { get; private set; }
        public void InitializeBeforeStartup(IServiceCollection services)
        {
            throw new System.NotImplementedException();
        }

        public void OnStartup()
        {
            throw new System.NotImplementedException();
        }
    }
}