using Microsoft.EntityFrameworkCore;
using XKS.Data.Backing;

namespace XKS.Data
{
	public class StandardDbContext : DbContext
	{
		public DbSet<Deck> Decks { get; set; }
		public DbSet<Card> Cards { get; set; }
		public DbSet<CardTag> CardTags { get; set; }
		public DbSet<Tag> Tags { get; set; }
		
		public StandardDbContext(DbContextOptions<StandardDbContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(StandardDbContext).Assembly);
		}
	}
}