using System;
using Gtk;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;
using XKS.Common.Configuration;
using XKS.Core.Service;
using Container = StructureMap.Container;

namespace XKS.App.Configuration
{
	[RegisteredModule]
	internal sealed class AppModule : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		public bool InitializedSuccessfully { get; private set; }

		private const string ApplicationId = "com.dobrovolskis.xks"; 
		
		private readonly Application _app =
			new Application(ApplicationId, GLib.ApplicationFlags.None);

		public Registry InitializeBeforeStartup()
		{
			try
			{
				Application.Init();
				_app.Register(GLib.Cancellable.Current);

				InitializedSuccessfully = true;

			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				InitializedSuccessfully = false;
			}
			
			return new AppRegistry();
		}

		public void OnStartup(Container container)
		{
			/*var win = container.GetInstance<DeckListController>();
			
			_app.AddWindow(win);

			win.Show();

			Application.Run();*/

			var e = container.GetInstance<IDeckService>();
			
		}

		public class AppRegistry : Registry
		{
			public AppRegistry()
			{
				For<IExampleService>().Use<ExampleService>();
				For<DeckListController>().Use<DeckListController>();
			}
		}
	}
}
