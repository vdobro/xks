using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using XKS.Model;

namespace XKS.Data.Configuration
{
	public class StandardDbContext : DbContext
	{
		private const string GeneralPrefix = "xks";
		private const char Separator = '_';

		public DbSet<Deck>?             Decks             { get; set; }
		public DbSet<Table>?            Tables            { get; set; }
		public DbSet<TableRow>?         TableRows         { get; set; }
		public DbSet<ColumnDefinition>? ColumnDefinitions { get; set; }
		public DbSet<TableCell>?        Tokens            { get; set; }
		public DbSet<DirectedGraph>?    Graphs            { get; set; }
		public DbSet<GraphNode>?        GraphNodes        { get; set; }

		public StandardDbContext(DbContextOptions<StandardDbContext> options)
			: base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.ApplyConfigurationsFromAssembly(typeof(StandardDbContext).Assembly);

			foreach (var entity in modelBuilder.Model.GetEntityTypes())
			{
				entity.SetTableName(GeneralPrefix + Separator + entity.DisplayName().ToSnakeCase());

				// Replace column names            
				foreach (var property in entity.GetProperties())
				{
					property.SetColumnName(property.GetColumnName().ToSnakeCase());

					if (property.IsPrimaryKey())
					{
						property.SetColumnName(GeneralPrefix + Separator + property.GetColumnName());
					}
				}

				foreach (var key in entity.GetKeys())
				{
					key.SetName(key.GetName().ToSnakeCase());
				}

				foreach (var key in entity.GetForeignKeys())
				{
					key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
				}

				foreach (var index in entity.GetIndexes())
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
			if (string.IsNullOrEmpty(name))
			{
				return name;
			}

			var startUnderscores = Regex.Match(name, @"^_+");
			var newName = startUnderscores + Regex.Replace(
				              name,
				              @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
			return newName;
		}
	}
}