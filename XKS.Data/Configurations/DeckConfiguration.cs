using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XKS.Data.Backing;

namespace XKS.Data.Configurations
{
	public class DeckConfiguration : IEntityTypeConfiguration<Deck>
	{
		public void Configure(EntityTypeBuilder<Deck> builder)
		{
			builder.HasKey(x => x.ID);

			builder.Property(x => x.Name).IsRequired();
			
		}
	}
}