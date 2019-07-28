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
				entity.Relational().TableName 
					= GeneralPrefix + entity.DisplayName().ToSnakeCase();

				// Replace column names            
				foreach(var property in entity.GetProperties())
				{
					property.Relational().ColumnName 
						= property.Relational().ColumnName.ToSnakeCase();
					
					if (property.IsPrimaryKey())
					{
						property.Relational().ColumnName = 
							GeneralPrefix + property.Relational().ColumnName;
					}
				}

				foreach(var key in entity.GetKeys())
				{
					key.Relational().Name = key.Relational().Name.ToSnakeCase();
				}

				foreach(var key in entity.GetForeignKeys())
				{
					key.Relational().Name = key.Relational().Name.ToSnakeCase();
				}

				foreach(var index in entity.GetIndexes())
				{
					index.Relational().Name = index.Relational().Name.ToSnakeCase();
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