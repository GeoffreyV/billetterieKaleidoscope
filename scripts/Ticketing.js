class Ticketing {
    constructor($parentContainer, $ticketing, $ticketingChoice) {
        this.$parentContainer = $parentContainer;
        this.$ticketing = $ticketing;
        this.nbOfTicketing = $ticketing.length;
        this.$ticketingChoice = $ticketingChoice;
    }

    init() {
        // this.$parentContainer.append(this.$ticketing);
        this.$parentContainer.hide();
        this.$ticketingChoice.hide();
        this.$ticketing.hide();
    }

    showTicketing(index) {
        this.$ticketing.each(function () {
            $(this).attr('src', $(this).attr('data-src'));
        });
        this.$parentContainer.fadeIn();
        this.$ticketingChoice.fadeOut('fast', () => {
            this.$ticketing.fadeOut('fast', () => {
                this.$ticketing.eq(index).fadeIn();
            });
        });
    }

    showTicketingChoice() {
        this.$ticketingChoice.fadeIn();
    }

    fadeOut(...args) {
        this.$parentContainer.fadeOut.apply(this.$parentContainer, args);
    }
    fadeIn(...args) {
        this.$parentContainer.fadeIn.apply(this.$parentContainer, args);
    }




}