using System;
using System.Threading.Tasks;
using NUnit.Framework;
using XKS.Common.Entities;
using XKS.Core.Repository;
using XKS.Data.Repositories;
using XKS.Data.Tests.Infrastructure;

namespace XKS.Data.Tests
{
	public class SampleTest : BaseTest
	{
		private IEntityRepository<Deck> _deckRepo;
		
		[SetUp]
		public void Setup()
		{
			_deckRepo = new DeckRepository(DbContext, Mapper);
		}

		[Test]
		public async Task CreateDeck()
		{
			Assert.IsEmpty(await _deckRepo.GetAll());

			var deck = new Deck()
			{
				Name = $"new deck {Guid.NewGuid()}"
			};
			deck = await _deckRepo.Save(deck);
			
			Assert.IsNotEmpty(await _deckRepo.GetAll());

			Assert.AreEqual((await _deckRepo.Find(deck.ID)).Name, deck.Name);
		}
	}
}