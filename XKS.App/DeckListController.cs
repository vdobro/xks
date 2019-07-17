using System.Threading.Tasks;
using Gtk;
using XKS.App.Resource;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS.App
{
	public class DeckListController : Window
	{
		[UI] 
		private ListStore deckListStore = null;

		[UI] 
		private Button btnOpen = null;
		[UI] 
		private FileChooserDialog deckChooser = null;
		
		public DeckListController() : this(
			new Builder(ResourceConfiguration.DeckListWindowFile))
		{
		}
		
		private DeckListController(Builder builder) : base(builder
			.GetObject(ResourceConfiguration.DeckListUI).Handle)
		{
			builder.Autoconnect(this);
			
			DeleteEvent += Window_DeleteEvent;
		}
		
		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}

		private async Task OnOpenClicked()
		{
			for (var i = 0; i < 10; i++)
			{
				deckListStore.AppendValues(await GetNextName(i));
			}
		}

		private async Task<string> GetNextName(int i)
		{
			await Task.Delay(2000);
			return "Deck" + i;
		}
	}
}