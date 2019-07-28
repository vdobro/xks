using System;
using Gtk;

namespace XKS.App.Views
{
    public class MainView
    {
        private readonly Stack learningStack;
        
        private readonly Box questionViewBox;
        private readonly Label questionLabel;
        private readonly Entry questionEntryBox;
        
        private readonly Box answerViewBox;
        private readonly Label answerLabel;
        private readonly Button nextQuestionButton;
        private readonly Button typoButton;

        public MainView(Stack learningStack, 
            Box questionViewBox, 
            Label questionLabel,
            Entry questionEntryBox,
            Box answerViewBox, 
            Label answerLabel,
            Button nextQuestionButton,
            Button typoButton)
        {
            this.learningStack = learningStack 
                                 ?? throw new ArgumentNullException(nameof(learningStack));
            this.questionViewBox = questionViewBox 
                                   ?? throw new ArgumentNullException(nameof(questionViewBox));
            this.questionLabel = questionLabel 
                                 ?? throw new ArgumentNullException(nameof(questionLabel));
            this.questionEntryBox = questionEntryBox 
                                    ?? throw new ArgumentNullException(nameof(questionEntryBox));
            this.answerViewBox = answerViewBox 
                                 ?? throw new ArgumentNullException(nameof(answerViewBox));
            this.answerLabel = answerLabel
                               ?? throw new ArgumentNullException(nameof(answerLabel));
            this.nextQuestionButton = nextQuestionButton 
                                      ?? throw new ArgumentNullException(nameof(nextQuestionButton));
            this.typoButton = typoButton 
                              ?? throw new ArgumentNullException(nameof(typoButton));
            
            ConnectEventHandlers();
        }

        private void ConnectEventHandlers()
        {
            
        }
    }
}