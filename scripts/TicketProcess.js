class TicketProcess {
    static States = {
        SLIDER: 'slider',
        QUESTIONNAIRE_BRIEFING: 'questionnaire_briefing',
        AWAIT_NEXT_QUESTION: 'await_next_question',
        QUESTIONS: 'questions',
        NEXT_QUESTION: 'next_question',
        TICKETING: 'ticketing'

    }

    static Transitions = {
        GO_FORWARD: 'go_forward',
        GO_BACKWARD: 'go_backward',
        GO_TO_TICKET: 'go_to_ticket_choice',
        RESET_QUESTIONS: 'reset_questions',
        GO_TO_SLIDER: 'go_to_slider',
    }

    constructor(questionnaire, slider, ticketingObj, $preamble, $questionnaire) {
        this.state = TicketProcess.States.SLIDER;
        this.questionnaire = questionnaire;
        this.$questionnaire = $questionnaire;
        this.slider = slider;
        this.ticket = ticketingObj;
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
                    this.state = TicketProcess.States.TICKETING;
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
                if (transition === TicketProcess.Transitions.GO_TO_TICKET) {
                    this.state = TicketProcess.States.TICKETING;
                    return true;
                }
                else {
                    this.state = TicketProcess.States.AWAIT_NEXT_QUESTION;
                    return true;
                }
                break;
            case TicketProcess.States.TICKETING:
                if (transition === TicketProcess.Transitions.GO_TO_NON_IMPROV) {
                    this.state = TicketProcess.States.TICKET_NON_IMPROV;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_TO_IMPROV) {
                    this.state = TicketProcess.States.TICKET_IMPROV;
                    return true;
                }
                if (transition === TicketProcess.Transitions.GO_TO_SLIDER) {
                    this.state = TicketProcess.States.SLIDER;
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
                    this.ticket.fadeOut('fast', () => {
                        this.$preamble.fadeOut('fast', () => {
                            this.slider.fadeIn();
                        });
                    });
                });
                break;
            case TicketProcess.States.QUESTIONNAIRE_BRIEFING:
                this.slider.fadeOut('fast', () => {
                    this.ticket.fadeOut('fast', () => {
                        this.$questionnaire.fadeOut('fast', () => {
                            this.$preamble.fadeIn();
                        });
                    });
                });
                break;
            case TicketProcess.States.QUESTIONS:
                this.$preamble.fadeOut('fast', () => {
                    this.slider.fadeOut('fast', () => {
                        this.ticket.fadeOut('fast', () => {
                            this.$questionnaire.fadeIn('fast');
                        });
                    });
                });
                break;
            case TicketProcess.States.AWAIT_NEXT_QUESTION:
                break;
            case TicketProcess.States.NEXT_QUESTION:
                if (!this.questionnaire.nextQuestion()) {
                    this.event(TicketProcess.Transitions.GO_TO_TICKET);
                }
                break;
            case TicketProcess.States.TICKETING:
                this.$questionnaire.fadeOut('fast', () => {
                    this.slider.fadeOut('fast', () => {
                        this.ticket.fadeOut('fast', () => {
                           /* this.slider.reduce();
                            this.slider.slideDown('slow');*/
                            this.ticket.showTicketingChoice();
                            this.ticket.fadeIn();
                        });
                    });
                });
                break;
        }
    }


}