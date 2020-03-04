using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace XKS.Web.Models
{
	public sealed class Permission
	{
		[Key] [Required] public string Key { get; private set; }

		[Required] public string DescriptionKey { get; private set; }

		[Required] public bool HasProxy { get; private set; }

		public ICollection<RoleHasPermission> Roles { get; private set; }

		public Permission(string key,
		                  bool   hasProxy,
		                  string descriptionKey)
		{
			Key = key;
			DescriptionKey = descriptionKey;
			HasProxy = hasProxy;
		}

		private Permission()
		{
		}
	}
}