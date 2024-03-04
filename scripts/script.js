const nextButton = document.getElementById('next-button');
const sliderSection = document.getElementById('slider-container');
const $sliderContainer = $('#slider-container');
const questionsSection = document.getElementById('questions-container');
const billetterieImpro = document.getElementById('haWidget-impro');
const billetterieNonImpro = document.getElementById('haWidget-non-impro');
const choixImproNonImpro = document.getElementById('choix-impro-non-impro');
const improButton = document.getElementById('impro');
const retourButton = document.getElementById('retour');
const nonImproButton = document.getElementById('non-impro');
const titreBilletterie = document.getElementById('titre-billetterie');
const billetterie = document.getElementById('billetterie');



// Slider
const slider = new Slider('json/', 'tarifs.json', 'slider-container');
const ticketQuestionnaire = new Questionnaire('json/', 'question_sans_image.json', $('#questions-container'));
const ticketing = new Ticketing($('#ticketing-container'), $('.ticketing'), $('#ticketing-choice'));
const ticketProcess = new TicketProcess(ticketQuestionnaire, slider, ticketing, $('#preamble'), $('#questionnaire-div'));

slider.initialize();
ticketing.init();
ticketProcess.initialize();

$('#activate-impro').click(function(e) {
    e.preventDefault(); // Prevent the default action of the link
    $('#btnradio1').prop('checked', true); // Check the radio button
    showImpro();
});

$('#activate-non-impro').click(function(e) {
    e.preventDefault(); // Prevent the default action of the link
    $('#btnradio2').prop('checked', true); // Check the radio button
    showNonImpro();
});




// Display the questions from the second question onwards
function showQuestions() {
    questionsSection.style.display = 'block';
    setTimeout(function () {
        questionsSection.classList.remove('out');
        questionsSection.classList.add('in');
    }, 0);
}

function hideQuestions() {
    questionsSection.style.display = 'none';
}


let currentPage = 0;

function nextPrev(stepToNextPage) {
    if(stepToNextPage === 1) {
        ticketProcess.event(TicketProcess.Transitions.GO_FORWARD);
    }
    else {
        ticketProcess.event(TicketProcess.Transitions.GO_BACKWARD);
    }  

}

function showImpro() {
    $('#ticket-type').text('Billetterie Improvisateurices')
    $('#back-to-other').text('Vers la billetterie non-improvisateurices');
    $('#back-to-other').attr('onclick', 'showNonImpro()');
    ticketing.showTicketing(0);
}

function showNonImpro() {
    $('#ticket-type').text('Billetterie Non-Improvisateurices');
    $('#back-to-other').text('Vers la billetterie improvisateurices');
    $('#back-to-other').attr('onclick', 'showImpro()');
    ticketing.showTicketing(1);
}

function backToChoice() {
    billetterieImpro.classList.add('nodisplay');
    billetterieNonImpro.classList.add('nodisplay');
    nonImproButton.classList.remove('nodisplay');
    improButton.classList.remove('nodisplay');
    retourButton.classList.add('nodisplay');
    titreBilletterie.textContent = 'Choisissez votre billetterie';
}


