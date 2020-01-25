using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XKS.Model;

namespace XKS.Service
{
	public interface IDeckService
	{
		Task<IEnumerable<Deck>> GetAll();

		Task<Deck> Find(Guid id);

		Task<Deck> Create(Deck deck);
	}
}