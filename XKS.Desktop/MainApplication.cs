using GLib;
using Microsoft.EntityFrameworkCore;
using StructureMap;
using XKS.Controller;
using Application = Gtk.Application;

namespace XKS
{
	public class MainApplication
	{
		private const string ApplicationId = "com.dobrovolskis.xks";

		private readonly Application _app =
			new Application(ApplicationId, ApplicationFlags.None);

		private readonly Container _container;

		public MainApplication()
		{
			_container = BuildServiceCollection();

			Application.Init();
			_app.Register(Cancellable.Current);
		}

		public void Run()
		{
			var window = _container.GetInstance<MainWindowController>();

			_app.AddWindow(window);

			window.Show();

			Initialize(window);

			Application.Run();
		}

		private async void Initialize(MainWindowController window)
		{
			await using var dbContext = _container.GetInstance<DbContext>();

			await dbContext.Database.EnsureCreatedAsync();
			await dbContext.Database.MigrateAsync();

			window.Initialize();
		}

		private static Container BuildServiceCollection()
		{
			return new Container(_ =>
			{
				_.Scan(x =>
				{
					x.TheCallingAssembly();
					x.LookForRegistries();
				});
			});
		}
	}
}