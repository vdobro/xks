using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XKS.Core.Decks.Models;

namespace XKS.Core.Service
{
	public interface IDeckService
	{
		Task<IEnumerable<DeckDto>> GetAll();
	}
}