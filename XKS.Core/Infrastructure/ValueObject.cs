using System.Collections.Generic;
using System.Linq;

namespace XKS.Core.Infrastructure
{
	public abstract class ValueObject
	{
		protected static bool EqualsOperator(ValueObject left, ValueObject right)
		{
			if (left is null ^ right is null)
			{
				return false;
			}

			return left?.Equals(right) != false;
		}

		protected static bool NotEqualsOperator(ValueObject left, ValueObject right)
		{
			return !(EqualsOperator(left, right));
		}

		protected abstract IEnumerable<object> GetAtomicValues();

		public override bool Equals(object obj)
		{
			if (obj == null || obj.GetType() != this.GetType())
			{
				return false;
			}

			var other = (ValueObject) obj;
			using (var thisValues = GetAtomicValues().GetEnumerator())
			{
				using (var otherValues = other.GetAtomicValues().GetEnumerator())
				{
					while (thisValues.MoveNext() && otherValues.MoveNext())
					{
						if (thisValues.Current is null ^ otherValues.Current is null)
						{
							return false;
						}

						if (thisValues.Current != null && 
						    !thisValues.Current.Equals(otherValues.Current))
						{
							return false;
						}
					}

					return !thisValues.MoveNext() && !otherValues.MoveNext();
				}
			}
		}

		public override int GetHashCode()
		{
			return GetAtomicValues()
				.Select(x => x != null ? x.GetHashCode() : 0)
				.Aggregate((x, y) => x ^ y);
		}
	}
}