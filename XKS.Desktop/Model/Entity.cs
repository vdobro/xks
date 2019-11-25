using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XKS.Model
{
	public class Entity
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
		public Guid ID { get; set; }
	}
}