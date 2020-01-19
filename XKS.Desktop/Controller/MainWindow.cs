using Gtk;
using XKS.Resource;
using XKS.Service;
using XKS.View;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.Controller
{
	public class MainWindow : Window
	{
		private readonly MainWindowOrchestrator _orchestrator;

		#region UI

		[UI] private readonly Viewport? deckListViewport  = null;
		[UI] private readonly ListBox?  deckList          = null;
		[UI] private readonly Stack?    mainStack         = null;
		[UI] private readonly Button?   backButton        = null;
		[UI] private readonly Button?   newItemButton     = null;
		[UI] private readonly Popover?  newDeckPopover    = null;
		[UI] private readonly Entry?    newDeckTitleEntry = null;

		[UI] private readonly StackSwitcher? deckModeStackSwitcher = null;
		[UI] private readonly Stack?         deckModeStack         = null;
		[UI] private readonly Box?           questionViewBox       = null;
		[UI] private readonly InfoBar?       answerFeedbackBar     = null;
		[UI] private readonly Label?         questionLabel         = null;
		[UI] private readonly Entry?         questionEntryBox      = null;
		[UI] private readonly Label?         correctAnswerLabel    = null;
		[UI] private readonly Label?         actualAnswerLabel     = null;
		[UI] private readonly Button?        acceptButton          = null;

		#endregion

		public MainWindow(IDeckService deckService)
			: this(new Builder(ResourceConfiguration.MainWindowFile),
			       deckService)
		{
		}

		private MainWindow(Builder builder, IDeckService deckService)
			: base(builder.GetObject(ResourceConfiguration.MainUI).Handle)
		{
			var deckService1 = deckService;

			builder.Autoconnect(this);

			var newDeckView = new NewDeckView(deckService1!,
			                                   newDeckPopover!,
			                                   newDeckTitleEntry!);
			
			var deckListView = new DeckListView(deckService1, deckList!);

			var mainView = new MainView(deckService1,
			                             deckModeStack!,
			                             questionViewBox!,
			                             questionLabel!,
			                             questionEntryBox!,
			                             answerFeedbackBar!,
			                             correctAnswerLabel!,
			                             actualAnswerLabel!,
			                             acceptButton!);


			_orchestrator = new MainWindowOrchestrator(newItemButton!,
			                                           backButton!,
			                                           deckModeStackSwitcher!,
			                                           mainStack!,
			                                           deckModeStack!,
			                                           deckListViewport!,
			                                           newDeckView!,
			                                           deckListView!,
			                                           mainView!);
		}

		public void Initialize()
		{
			ConnectEventHandlers();
			_orchestrator.Initialize();
		} 

		private void ConnectEventHandlers()
		{
			DeleteEvent += Window_DeleteEvent;
		}

		private void Window_DeleteEvent(object? sender, DeleteEventArgs a)
		{
			Application.Quit();
		}
	}
}