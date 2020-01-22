using XKS.View;

namespace XKS.Controller
{
	public class SessionController
	{
		private readonly SessionView _view;

		public SessionController(SessionView view)
		{
			_view = view;
		}
	}
}