using System;
using Gtk;

namespace XKS.App.Views
{
    public class DeckListView
    {
        private readonly ListBox deckList;
        private readonly Stack mainStack;
        private readonly Button newDeckButton;
        private readonly StackSwitcher deckModeStackSwitcher;

        public DeckListView(StackSwitcher deckModeStackSwitcher, ListBox deckList, Stack mainStack,
            Button newDeckButton)
        {
            this.deckModeStackSwitcher 
                = deckModeStackSwitcher ?? throw 
                      new ArgumentNullException(nameof(deckModeStackSwitcher));
            this.deckList = deckList ?? throw 
                                new ArgumentNullException(nameof(deckList));
            this.mainStack = mainStack ?? throw 
                                 new ArgumentNullException(nameof(mainStack));
            this.newDeckButton = newDeckButton ?? throw 
                                     new ArgumentNullException(nameof(newDeckButton));

            PrepareViews();

            ConnectEventHandlers();
        }

        private void PrepareViews()
        {
        }

        private void ConnectEventHandlers()
        {
        }
    }
}