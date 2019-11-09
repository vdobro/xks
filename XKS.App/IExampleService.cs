using System;

namespace XKS.App
{
	public interface IExampleService
	{
		void Do();
	}

	class ExampleService : IExampleService
	{
		public ExampleService()
		{
			
		}
		public void Do()
		{
			Console.WriteLine("Do!");
		}
	}
}