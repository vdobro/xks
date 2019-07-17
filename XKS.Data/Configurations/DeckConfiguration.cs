using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XKS.Data.Backing;

namespace XKS.Data.Configurations
{
	public class DeckConfiguration : IEntityTypeConfiguration<Deck>
	{
		public void Configure(EntityTypeBuilder<Deck> builder)
		{
			builder.ToTable("xks_deck");
			
			builder.Property(x => x.ID)
				.HasColumnName("xks_id")
				.IsRequired();

			builder.Property(x => x.Name)
				.HasColumnName("name")
				.IsRequired();
			
			builder.HasKey(x => x.ID);
		}
	}
}