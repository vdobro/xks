using XKS.View;

namespace XKS.Controller
{
	public sealed class SessionController
	{
		private readonly SessionView _view;

		public SessionController(SessionView view)
		{
			_view = view;
		}

		public void SetDefaultFocus()
		{
			_view.QuestionEntryBox.GrabFocus();
		}
	}
}