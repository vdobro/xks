using System;
using System.ComponentModel.DataAnnotations;

namespace XKS.Web.Models
{
	public sealed class RoleHasPermission
	{
		[Required] public Guid     RoleID { get; set; }
		[Required] public UserRole Role   { get; set; }

		[Required] public string     PermissionKey { get; set; }
		[Required] public Permission Permission    { get; set; }
	}
}