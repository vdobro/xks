using System;

namespace XKS.Core.View
{
	public sealed class CardView
	{
		public Guid ID { get; }
		public string Question { get; } 
		public DateTime Timestamp { get; }
		
		public CardView(Guid id, string question, DateTime timestamp)
		{
			ID = id;
			Question = question ?? throw new ArgumentNullException(nameof(question));
			Timestamp = timestamp;
		}
	}
}
