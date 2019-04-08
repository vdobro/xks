using System;

namespace XKS.Domain.Model
{
	public abstract class ModelBase
	{
		public Guid ID { get; }

		protected ModelBase(Guid id)
		{
			this.ID = id;
		}

		protected ModelBase() : this(Guid.NewGuid())
		{
		}
	}
}
