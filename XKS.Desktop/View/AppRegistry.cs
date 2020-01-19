using StructureMap;
using XKS.Controller;

namespace XKS.View
{
	public class AppRegistry : Registry
	{
		public AppRegistry()
		{
			For<MainWindow>().Use<MainWindow>();
		}
	}
}