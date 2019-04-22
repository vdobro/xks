using System;

namespace XKS.Launcher
{
	internal static class Program
	{
		[STAThread]
		private static void Main(string[] args)
		{
			ModuleConfiguration.StartApplication();
		}
	}
}
