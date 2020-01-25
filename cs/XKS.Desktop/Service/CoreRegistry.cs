using StructureMap;
using XKS.Service.Implementation;

namespace XKS.Service
{
	public class CoreRegistry : Registry
	{
		public CoreRegistry()
		{
			For<IDeckService>().Use<DeckService>();
			For<ITableService>().Use<TableService>();
			For<ITableCellValidationService>().Use<TableCellValidationService>();
			For<ITableCellService>().Use<TableCellService>();
		}
	}
}