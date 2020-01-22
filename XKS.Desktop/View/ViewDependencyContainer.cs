using StructureMap;

namespace XKS.View
{
	public static class ViewDependencyContainer
	{
		public static void Build(Container container, MainWindow window)
		{
			container.Inject(window.ConstructDeckListView());
			container.Inject(window.ConstructEditView());
			container.Inject(window.ConstructMainView());
			container.Inject(window.ConstructNewDeckDialogView());
			container.Inject(window.ConstructSessionView());
		}
	}
}