class TicketProcess {
    static States = {
        SLIDER: 'slider',
        QUESTIONNAIRE_BRIEFING: 'questionnaire_briefing',
        AWAIT_NEXT_QUESTION: 'await_next_question',
        QUESTIONS: 'questions',
        NEXT_QUESTION: 'next_question',
        TICKET: 'ticket'


    }

    static Transitions = {
        GO_FORWARD: 'go_forward',
        GO_BACKWARD: 'go_backward',
        GO_TO_TICKET: 'go_to_ticket',
        RESET_QUESTIONS: 'reset_questions',
        GO_TO_SLIDER: 'go_to_slider',
    }

    constructor(questionnaire, $slider, $ticket, $preamble, $questionnaire) {
        this.state = TicketProcess.States.SLIDER;
        this.questionnaire = questionnaire;
        this.$questionnaire = $questionnaire;
        this.$slider = $slider;
        this.$ticket = $ticket;
        this.$preamble = $preamble;
    }

    initialize() {
        this.questionnaire.initialize().then(() => {
            this.questionnaire.appendQuestionsToContainer();
            this.questionnaire.firstQuestion();
            this.render();
        });
    }


    changeState(transition) {
        switch (this.state) {
            case TicketProcess.States.SLIDER:
                if (transition === TicketProcess.Transitions.GO_FORWARD) {
                    if (!this.questionnaire.hasBegan()) {
                        this.state = TicketProcess.States.QUESTIONNAIRE_BRIEFING;
                        return true;
                    }
                    else {
                        this.state = TicketProcess.States.QUESTIONS;
                        return true;
                    }
                }
                break;
            case TicketProcess.States.QUESTIONNAIRE_BRIEFING:
                if (transition === TicketProcess.Transitions.GO_FORWARD) {
                    this.state = TicketProcess.States.QUESTIONS;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_BACKWARD) {
                    this.state = TicketProcess.States.SLIDER;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_TO_SLIDER) {
                    this.state = TicketProcess.States.SLIDER;
                    return true;
                }
                break;
            case TicketProcess.States.QUESTIONS:
                this.state = TicketProcess.States.AWAIT_NEXT_QUESTION;
                return true;
                break;
            case TicketProcess.States.AWAIT_NEXT_QUESTION:
                if (transition === TicketProcess.Transitions.GO_FORWARD) {
                    this.state = TicketProcess.States.NEXT_QUESTION;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_TO_TICKET) {
                    this.state = TicketProcess.States.TICKET;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_TO_SLIDER) {
                    this.state = TicketProcess.States.SLIDER;
                    return true;
                }
                if (transition === TicketProcess.Transitions.RESET_QUESTIONS) {
                    this.state = TicketProcess.States.QUESTIONNAIRE_BRIEFING;
                    return true;
                }
                break;
            case TicketProcess.States.NEXT_QUESTION:
                this.state = TicketProcess.States.QUESTIONS;
                return true;
                break;
            case TicketProcess.States.TICKET:
                if (transition === TicketProcess.Transitions.RESET_QUESTIONS) {
                    this.state = TicketProcess.States.QUESTIONNAIRE_BRIEFING;
                    return true;
                }
                break;
        }
        return false;
    }

    event(transition) {
        while (this.changeState(transition)) {
            transition = null;
            this.render();
        }
    }

    render() {
        switch (this.state) {
            case TicketProcess.States.SLIDER:
                this.$questionnaire.fadeOut('fast', () => {
                    this.$ticket.fadeOut('fast', () => {
                        this.$preamble.fadeOut('fast', () => {
                            this.$slider.fadeIn();
                        });
                    });
                });
                break;
            case TicketProcess.States.QUESTIONNAIRE_BRIEFING:
                this.$slider.fadeOut('fast', () => {
                    this.$ticket.fadeOut('fast', () => {
                        this.$questionnaire.fadeOut('fast', () => {
                            this.$preamble.fadeIn();
                        });
                    });
                });
                break;
            case TicketProcess.States.QUESTIONS:
                this.$preamble.fadeOut('fast', () => {
                    this.$slider.fadeOut('fast', () => {
                        this.$ticket.fadeOut('fast', () => {
                            this.$questionnaire.fadeIn('fast');
                        });
                    });
                });
                break;
            case TicketProcess.States.AWAIT_NEXT_QUESTION:
                break;
            case TicketProcess.States.NEXT_QUESTION:
                if(!this.questionnaire.nextQuestion()) {
                    this.event(TicketProcess.Transitions.GO_TO_TICKET);
                }
                break;
            case TicketProcess.States.TICKET:
                this.$questionnaire.fadeOut('fast', () => {
                    this.$slider.fadeOut('fast', () => {
                        this.$ticket.fadeIn();
                    });
                });
                break;
        }
    }


}