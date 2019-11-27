using StructureMap;

namespace XKS.View
{
	public class AppRegistry : Registry
	{
		public AppRegistry()
		{
			For<MainWindowController>().Use<MainWindowController>();
		}
	}
}