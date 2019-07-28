using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XKS.Data.Backing;

namespace XKS.Data.Configurations
{
	public class CardTagConfiguration : IEntityTypeConfiguration<CardTag>
	{
		public void Configure(EntityTypeBuilder<CardTag> builder)
		{
			builder.HasKey(x => new {x.CardID, x.TagID});

			builder.HasOne(x => x.Card)
				.WithMany(x => x.TagLinks)
				.HasForeignKey(x => x.CardID)
				.OnDelete(DeleteBehavior.Cascade);

			builder.HasOne(x => x.Tag)
				.WithMany(x => x.CardLinks)
				.HasForeignKey(x => x.TagID)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}