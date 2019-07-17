using System;
using System.Threading.Tasks;
using NUnit.Framework;
using XKS.Core.Entities;
using XKS.Data.Repositories;
using XKS.Data.Tests.Infrastructure;
using XKS.Domain.Repository;

namespace XKS.Data.Tests
{
	public class SampleTest : BaseTest
	{
		private IEntityRepository<Deck> deckRepo;
		
		[SetUp]
		public void Setup()
		{
			deckRepo = new DeckRepository(DbContext, Mapper);
		}

		[Test]
		public async Task CreateDeck()
		{
			Assert.IsEmpty(deckRepo.GetAll());

			var deck = new Deck()
			{
				Name = $"new deck {Guid.NewGuid()}"
			};
			deck = await deckRepo.Save(deck);
			
			Assert.IsNotEmpty(deckRepo.GetAll());

			Assert.AreEqual((await deckRepo.Find(deck.ID)).Name, deck.Name);
			
		}

	}
}