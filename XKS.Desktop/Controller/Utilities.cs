using Gtk;

namespace XKS.Controller
{
	public static class Utilities
	{
		public static void ClearListBox(ListBox listBox)
		{
			foreach (var listChild in listBox.Children)
			{
				listBox.Remove(listChild);
			}
		}
	}
}