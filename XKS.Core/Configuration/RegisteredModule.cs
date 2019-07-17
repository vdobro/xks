namespace XKS.Core.Configuration
{
	[System.AttributeUsage(System.AttributeTargets.Class)]
	public class RegisteredModule : System.Attribute
	{
		private readonly string _name;

		public RegisteredModule(string name)
		{
			this._name = name;
		}
	}
}
