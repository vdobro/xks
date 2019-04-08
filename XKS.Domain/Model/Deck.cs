using System;

namespace XKS.Domain.Model
{
    public sealed class Deck : ModelBase
    {
        public string Name { get; }

        public Deck(string name)
        {
            Name = name;
        }
    }
}
