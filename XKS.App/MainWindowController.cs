using System;
using Gtk;
using XKS.App.Resource;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.App
{
	class MainWindowController : Window
	{
		[UI] private Entry answerEntryBox = null;
		[UI] private Button submitAnswerButton = null;
		[UI] private Stack mainSwitcherStack = null;

		private int _counter;

		public MainWindowController() : this(
			new Builder(ResourceConfiguration.MainWindowFile))
		{
		}

		private MainWindowController(Builder builder) : base(builder
			.GetObject(ResourceConfiguration.MainWindowUI).Handle)
		{
			builder.Autoconnect(this);

			DeleteEvent += Window_DeleteEvent;
			submitAnswerButton.Clicked += OnAnswerSubmitted;
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}

		private void OnAnswerSubmitted(object sender, EventArgs a)
		{
			_counter++;
			answerEntryBox.Text = "Hello World! This button has been clicked " + _counter + " time(s).";
		}
	}
}
