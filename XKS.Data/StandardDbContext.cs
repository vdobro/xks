using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using XKS.Data.Backing;

namespace XKS.Data
{
	public class StandardDbContext : DbContext
	{
		private const string GeneralPrefix = "xks_";
		public DbSet<Deck> Decks { get; set; }
		public DbSet<Card> Cards { get; set; }
		public DbSet<CardTag> CardTags { get; set; }
		public DbSet<Tag> Tags { get; set; }
		
		public StandardDbContext(DbContextOptions<StandardDbContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(StandardDbContext).Assembly);

			foreach (var entity in modelBuilder.Model.GetEntityTypes())
			{
				entity.SetTableName(GeneralPrefix + entity.DisplayName().ToSnakeCase());

				// Replace column names            
				foreach(var property in entity.GetProperties())
				{
					property.SetColumnName(property.GetColumnName().ToSnakeCase());
					
					if (property.IsPrimaryKey())
					{
						property.SetColumnName(GeneralPrefix + property.GetColumnName());
					}
				}

				foreach(var key in entity.GetKeys())
				{
					key.SetName(key.GetName().ToSnakeCase());
				}

				foreach(var key in entity.GetForeignKeys())
				{
					key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
				}

				foreach(var index in entity.GetIndexes())
				{
					index.SetName(index.GetName().ToSnakeCase());
				}
			}
		}	
	}

	public static class StringExtensions
	{
		public static string ToSnakeCase(this string name)
		{
			if (string.IsNullOrEmpty(name)) return name;

			var startUnderscores = Regex.Match(name, @"^_+");
			var newName = startUnderscores + Regex.Replace(name, 
				              @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
			return newName;
		}
	}
}