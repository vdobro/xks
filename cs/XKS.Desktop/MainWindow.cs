using Gtk;
using XKS.Resource;
using XKS.View;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS
{
	public class MainWindow : Window
	{
		#region UI

		[UI] private readonly Viewport? deckListViewport     = null;
		[UI] private readonly ListBox?  deckList             = null;
		[UI] private readonly Stack?    mainStack            = null;
		[UI] private readonly Button?   backButton           = null;
		[UI] private readonly Button?   newItemButton        = null;
		[UI] private readonly Popover?  newElementPopover    = null;
		[UI] private readonly Label?    nameLabel            = null;
		[UI] private readonly Entry?    newElementTitleEntry = null;

		[UI] private readonly StackSwitcher? deckModeStackSwitcher = null;
		[UI] private readonly Stack?         deckModeStack         = null;

		[UI] private readonly Box?     questionViewBox    = null;
		[UI] private readonly InfoBar? answerFeedbackBar  = null;
		[UI] private readonly Label?   questionLabel      = null;
		[UI] private readonly Entry?   questionEntryBox   = null;
		[UI] private readonly Label?   correctAnswerLabel = null;
		[UI] private readonly Label?   actualAnswerLabel  = null;
		[UI] private readonly Button?  acceptButton       = null;

		[UI] private readonly Paned? editStack         = null;
		[UI] private readonly Stack? itemEditModeStack = null;

		[UI] private readonly Toolbar?    tableEditorToolbar  = null;
		[UI] private readonly ToolButton? addColumnButton     = null;
		[UI] private readonly TreeView?   tableEditorView     = null;
		[UI] private readonly Notebook?   elementCategoryTabs = null;
		[UI] private readonly Viewport?   graphTab            = null;
		[UI] private readonly Viewport?   tableTab            = null;
		[UI] private readonly ListBox?    graphList           = null;
		[UI] private readonly ListBox?    tableList           = null;

		#endregion

		public MainWindow()
			: this(new Builder(ResourceConfiguration.MainWindowFile))
		{
			ConnectEventHandlers();
		}

		private MainWindow(Builder builder)
			: base(builder.GetObject(ResourceConfiguration.MainUI).Handle)
		{
			builder.Autoconnect(this);
		}

		public MainView ConstructMainView() =>
			new MainView(newItemButton!,
			             backButton!,
			             deckModeStackSwitcher!,
			             mainStack!,
			             deckListViewport!,
			             deckModeStack!,
			             questionViewBox!,
			             editStack!);

		public DeckListView ConstructDeckListView() => new DeckListView(deckList!);

		public NewElementDialogView ConstructNewDeckDialogView() =>
			new NewElementDialogView(newElementPopover!,
			                         nameLabel!,
			                         newElementTitleEntry!);

		public EditView ConstructEditView() =>
			new EditView(editStack!,
			             elementCategoryTabs!,
			             graphTab!,
			             tableTab!,
			             itemEditModeStack!);

		public TableEditorView ConstructTableEditorView() =>
			new TableEditorView(tableList!,
			                    tableEditorToolbar!,
			                    tableEditorView!,
			                    addColumnButton!);

		public GraphEditorView ConstructGraphEditorView() =>
			new GraphEditorView(graphList!);

		public SessionView ConstructSessionView() =>
			new SessionView(deckModeStack!,
			                questionViewBox!,
			                questionLabel!,
			                questionEntryBox!,
			                answerFeedbackBar!,
			                correctAnswerLabel!,
			                actualAnswerLabel!,
			                acceptButton!);

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