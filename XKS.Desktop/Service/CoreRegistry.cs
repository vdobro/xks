using StructureMap;
using XKS.Service.Implementation;

namespace XKS.Service
{
	public class CoreRegistry : Registry
	{
		public CoreRegistry()
		{
			For<IDeckService>().Use<DeckService>();
		}
	}
}