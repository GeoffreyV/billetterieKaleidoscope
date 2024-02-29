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
const slider = new Slider('', 'tarifs.json', 'slider-container');
const ticketQuestionnaire = new Questionnaire('', 'question_sans_image.json', $('#questions-container'));
const ticketProcess = new TicketProcess(ticketQuestionnaire, $sliderContainer, $('#billetterie'), $('#preamble'), $('#questionnaire-div'));

slider.initialize();
ticketProcess.initialize();



// Display the slider
function displaySlider() {
    $sliderContainer.fadeIn('fast');
}


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

displaySlider();


let currentPage = 0;

function nextPrev(stepToNextPage) {
    ticketProcess.event(TicketProcess.Transitions.GO_FORWARD);

}








function showImpro() {
    billetterieImpro.classList.remove('nodisplay');
    billetterieNonImpro.classList.add('nodisplay');
    nonImproButton.classList.add('nodisplay');
    improButton.classList.add('nodisplay');
    titreBilletterie.textContent = ' Improvisteurices';
    retourButton.classList.remove('nodisplay');

}

function showNonImpro() {
    billetterieNonImpro.classList.remove('nodisplay');
    billetterieImpro.classList.add('nodisplay');
    nonImproButton.classList.add('nodisplay');
    improButton.classList.add('nodisplay');
    retourButton.classList.remove('nodisplay');

    titreBilletterie.textContent = 'Vous êtes sur la billetterie Non-Improvistaeurices';
}

function backToChoice() {
    billetterieImpro.classList.add('nodisplay');
    billetterieNonImpro.classList.add('nodisplay');
    nonImproButton.classList.remove('nodisplay');
    improButton.classList.remove('nodisplay');
    retourButton.classList.add('nodisplay');
    titreBilletterie.textContent = 'Choisissez votre billetterie';
}


