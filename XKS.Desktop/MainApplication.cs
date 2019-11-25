using System;
using Gtk;
using Microsoft.EntityFrameworkCore;
using XKS.Data;
using XKS.Model;
using Container = StructureMap.Container;

namespace XKS
{
	public class MainApplication
	{
		private const string ApplicationId = "com.dobrovolskis.xks"; 
		
		private readonly Application _app =
			new Application(ApplicationId, GLib.ApplicationFlags.None);

		private readonly Container _container;
		private DeckListController _window;

		public MainApplication()
		{
			_container = BuildServiceCollection();
			
			Application.Init();
			_app.Register(GLib.Cancellable.Current);
		}

		public void Run(string[] args)
		{
			_window = _container.GetInstance<DeckListController>();
			
			_app.AddWindow(_window);

			_window.Show();
			
			Initialize();

			Application.Run();
		}
		
		private Container BuildServiceCollection()
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

		private async void Initialize()
		{
			await using var dbContext = _container.GetInstance<DbContext>();
			
			await dbContext.Database.EnsureCreatedAsync();
			await dbContext.Database.MigrateAsync();
			
			_window.Initialize();
		}
	}
}