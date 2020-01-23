using System.IO;
using GLib;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StructureMap;
using XKS.Controller;
using XKS.View;
using Application = Gtk.Application;
using Task = System.Threading.Tasks.Task;

namespace XKS
{
	public class MainApplication
	{
		private const string ApplicationId = "com.dobrovolskis.xks";
		private const string ConfigFile    = "appsettings.json";

		public static IConfiguration Configuration { get; } =
			new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
			                          .AddJsonFile(ConfigFile, false, true)
			                          .Build();

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
			var window = _container.GetInstance<MainWindow>();

			_app.AddWindow(window);

			window.Show();

			Initialize(window);

			Application.Run();
		}

		private async void Initialize(MainWindow window)
		{
			await InitPersistence();
			ViewDependencyContainer.Build(_container, window);

			var orchestrator = _container.GetInstance<MainControllerOrchestrator>();
			orchestrator.Initialize();
		}

		private Container BuildServiceCollection()
		{
			return new Container(_ =>
			{
				_.For<IConfiguration>().Use(x => Configuration);

				_.Scan(x =>
				{
					x.TheCallingAssembly();
					x.LookForRegistries();
				});
			});
		}

		private async Task InitPersistence()
		{
			await using var dbContext = _container.GetInstance<DbContext>();

			await dbContext.Database.EnsureCreatedAsync();
			await dbContext.Database.MigrateAsync();
		}
	}
}