using Avalonia;
using Avalonia.Markup.Xaml;

namespace XKS
{
    public class App : Application
    {
        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);
        }
   }
}