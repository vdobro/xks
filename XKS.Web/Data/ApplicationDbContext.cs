using XKS.Web.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace XKS.Web.Data
{
	public class ApplicationDbContext : ApiAuthorizationDbContext<User, UserRole, Guid>
	{
		public ApplicationDbContext(
			DbContextOptions                  options,
			IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
		{
		}
	}
}