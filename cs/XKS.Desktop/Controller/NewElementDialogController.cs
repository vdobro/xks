using System;
using Gtk;
using XKS.Service;
using XKS.View;

namespace XKS.Controller
{
	public sealed class NewElementDialogController
	{
		public event EventHandler<string> ElementCreated = delegate { };
		
		private readonly Popover _newItemPopover;
		private readonly Label   _nameLabel;
		private readonly Entry   _newItemTitleEntry;

		public string NameLabelText
		{
			get => _nameLabel.Text;
			set => _nameLabel.Text = value ?? "Name:";
		}

		public NewElementDialogController(NewElementDialogView newElementDialogView)
		{
			_newItemPopover = newElementDialogView.NewItemPopover;
			_nameLabel = newElementDialogView.NameLabel;
			_newItemTitleEntry = newElementDialogView.NewItemTitleEntry;

			_newItemTitleEntry.Activated += NewItemTitleEntryOnKeyPressEvent;
		}

		public void Open()
		{
			_newItemTitleEntry.Text = string.Empty;
			_newItemPopover.Show();
		}

		public void Close()
		{
			_newItemTitleEntry.Text = string.Empty;
			_newItemPopover.Hide();
		}

		private void NewItemTitleEntryOnKeyPressEvent(object? o, EventArgs eventArgs)
		{
			var titleValue = _newItemTitleEntry.Text.Trim();
			if (string.IsNullOrWhiteSpace(titleValue))
			{
				return;
			}
			
			ElementCreated.Invoke(this, titleValue);
			Close();
		}
	}
}