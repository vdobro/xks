using System.Runtime.CompilerServices;

namespace XKS.Domain.Configuration
{
	[System.AttributeUsage(System.AttributeTargets.Class)]
	public class RegisteredModule : System.Attribute
	{
		private readonly string name;

		public RegisteredModule(string name)
		{
			this.name = name;
		}
	}
}
