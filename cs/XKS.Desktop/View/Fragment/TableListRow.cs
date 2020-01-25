using System;
using Gtk;
using Table = XKS.Model.Table;

namespace XKS.View.Fragment
{
	internal sealed class TableListRow : ListBoxRow
	{
		public Guid TableId { get; }

		public TableListRow(Table table)
		{
			TableId = table.ID;
			var container = new Box(Orientation.Vertical, 8)
			{
				HeightRequest = 64, 
				WidthRequest = 100, 
				Homogeneous = true
			};
			container.Add(new Label(table.Title) {Xalign = 0.1f});
			container.Add(new Label($"{table.Rows.Count} row(s)") {Xalign = 0.9f});
			Add(container);
		}
	}
}