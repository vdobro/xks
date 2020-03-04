using System;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace XKS.Web.Data
{
	/// <summary>
	/// Database abstraction for a combined <see cref="DbContext"/> using ASP.NET Identity and Identity Server.
	/// </summary>
	/// <typeparam name="TUser"></typeparam>
	/// <typeparam name="TRole"></typeparam>
	/// <typeparam name="TKey"></typeparam>
	public class ApiAuthorizationDbContext<TUser, TRole, TKey>
		: IdentityDbContext<TUser, TRole, TKey>, IPersistedGrantDbContext
		where TUser : IdentityUser<TKey>
		where TKey : IEquatable<TKey>
		where TRole : IdentityRole<TKey>
	{
		private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

		/// <summary>
		/// Initializes a new instance of <see cref="ApiAuthorizationDbContext{TUser}"/>.
		/// </summary>
		/// <param name="options">The <see cref="DbContextOptions"/>.</param>
		/// <param name="operationalStoreOptions">The <see cref="IOptions{OperationalStoreOptions}"/>.</param>
		public ApiAuthorizationDbContext(
			DbContextOptions                  options,
			IOptions<OperationalStoreOptions> operationalStoreOptions)
			: base(options)
		{
			_operationalStoreOptions = operationalStoreOptions;
		}

		/// <summary>
		/// Gets or sets the <see cref="DbSet{PersistedGrant}"/>.
		/// </summary>
		public DbSet<PersistedGrant> PersistedGrants { get; set; }

		/// <summary>
		/// Gets or sets the <see cref="DbSet{DeviceFlowCodes}"/>.
		/// </summary>
		public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }

		Task<int> IPersistedGrantDbContext.SaveChangesAsync() => base.SaveChangesAsync();

		/// <inheritdoc />
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);
		}
	}
}