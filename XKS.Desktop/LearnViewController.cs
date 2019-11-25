using System;
using Gtk;
using XKS.Resource;
using UI = Gtk.Builder.ObjectAttribute;

namespace XKS
{
	class LearnViewController : Window
	{
		#region UI

		[UI] private Stack topStack = null;

		[UI] private Label questionLabel = null;
		
		[UI] private Box answerViewBox = null;
		[UI] private Label answerLabel = null;
		
		[UI] private Entry answerEntryBox = null;

		#endregion

		private bool _cardAnswered = false;

		public LearnViewController() : this(
			new Builder(ResourceConfiguration.MainWindowFile))
		{
		}

		private LearnViewController(Builder builder) : base(builder
			.GetObject(ResourceConfiguration.MainWindowUI).Handle)
		{
			builder.Autoconnect(this);

			DeleteEvent += Window_DeleteEvent;
			answerEntryBox.Activated += OnEnterClicked;
		}

		private void Window_DeleteEvent(object sender, DeleteEventArgs a)
		{
			Application.Quit();
		}

		private void OnEnterClicked(object sender, EventArgs a)
		{
			if (_cardAnswered)
			{
				_cardAnswered = false;
				SwitchToAnswerMode();
			}
			else
			{
				_cardAnswered = true;
				SwitchToQuestionMode();
			}
		}

		private void SwitchToAnswerMode()
		{
			topStack.VisibleChild = answerViewBox;
		}

		private void SwitchToQuestionMode()
		{
			topStack.VisibleChild = questionLabel;
		}
	}
}
