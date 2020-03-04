using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace XKS.Web.Models
{
	public sealed class UserRole : IdentityRole<Guid>
	{
		[Required] public bool Enabled { get; set; } = true;

		public ICollection<RoleHasPermission> Permissions { get; set; }

		public UserRole(string name) : base(name)
		{
		}
	}
}