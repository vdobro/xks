using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XKS.Data.Backing;

namespace XKS.Data.Configurations
{
	public class CardTagConfiguration : IEntityTypeConfiguration<CardTag>
	{
		public void Configure(EntityTypeBuilder<CardTag> builder)
		{
			builder.ToTable("xks_card_tag");
			
			builder.HasKey(x => new {x.CardID, x.TagID});

			builder.Property(x => x.CardID).HasColumnName("card_id");
			builder.Property(x => x.TagID).HasColumnName("tag_id");

			builder.HasOne(x => x.Card)
				.WithMany(x => x.TagLinks)
				.HasForeignKey(x => x.CardID)
				.OnDelete(DeleteBehavior.Cascade)
				.HasConstraintName("fk_xks_card_tag_cards");

			builder.HasOne(x => x.Tag)
				.WithMany(x => x.CardLinks)
				.HasForeignKey(x => x.TagID)
				.OnDelete(DeleteBehavior.Cascade)
				.HasConstraintName("fk_xks_card_tag_tags");
		}
	}
}