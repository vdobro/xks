using Gtk;
using XKS.App.Resource;
using XKS.App.Views;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.App
{
	public class DeckListController : Window
	{
		[UI] private ListBox deckList = null;
		[UI] private Stack mainStack = null;
		[UI] private Button newDeckButton = null;

		[UI] private StackSwitcher deckModeStackSwitcher = null;
		[UI] private Stack learningStack = null;
		[UI] private Box questionViewBox = null;
		[UI] private Label questionLabel = null;
		[UI] private Entry questionEntryBox = null;
		[UI] private Box answerViewBox = null;
		[UI] private Label answerLabel = null;
		[UI] private Button nextQuestionButton = null;
		[UI] private Button typoButton = null;

		private readonly DeckListView _deckListView;
		
		public DeckListController() : this(
			new Builder(ResourceConfiguration.DeckListWindowFile))
		{
		}
		
		private DeckListController(Builder builder) : base(builder
			.GetObject(ResourceConfiguration.DeckListUI).Handle)
		{
			builder.Autoconnect(this);
			
			deckModeStackSwitcher.Hide();
			
			_deckListView = new DeckListView(
				deckModeStackSwitcher, deckList, mainStack, newDeckButton);
			
			DeleteEvent += Window_DeleteEvent;
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}
	}
}