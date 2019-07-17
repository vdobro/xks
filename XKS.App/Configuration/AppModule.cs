using System;
using Gtk;
using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;

namespace XKS.App.Configuration
{
	[RegisteredModule("App module")]
	internal sealed class AppModule : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		public bool InitializedSuccessfully { get; private set; }

		private const string ApplicationId = "com.dobrovolskis.xks"; 
		
		private readonly Application _app =
			new Application(ApplicationId, GLib.ApplicationFlags.None);

		public void InitializeBeforeStartup(IServiceCollection services)
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
		}

		public void OnStartup()
		{
			var win = new DeckListController();
			_app.AddWindow(win);

			win.Show();
			Application.Run();
		}
	}
}
