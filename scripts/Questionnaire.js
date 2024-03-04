class ProgressBar {
    constructor($container) {
        this.$progressBar = null;
        this.$container = $container;
    }

    initialize() {
        this.$progressBar = $('<div>', {
            class: 'progress-bar',
            role: 'progressbar',
            style: 'width: 0%',
            'aria-valuenow': '0',
            'aria-valuemin': '0',
            'aria-valuemax': '100'
        });
        this.$container.prepend($('<div>', {class: 'progress'}).append(this.$progressBar));
    }

    update(value, max) {
        const progressPercentage = (value / max) * 100;
        this.$progressBar.css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
    }
}






class Questionnaire {
    constructor(prefixUrl, jsonFileName, $questionnaireContainer) {
        this._prefixUrl = prefixUrl;
        this._jsonFileName = prefixUrl + jsonFileName;
        this.$questions = [];
        this._currentQuestionIndex = 0;
        this.$questionnaireContainer = $questionnaireContainer;
        this.progressBar = new ProgressBar($questionnaireContainer); // Instanciation de la ProgressBar
        this.isOver = false;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            fetch(this._jsonFileName)
                .then(response => response.json())
                .then(data => {
                    this.$questions = data.map(this.generateQuestionElement.bind(this));
                })
                .then(() => {
                    this.appendQuestionsToContainer();
                    this.progressBar.initialize();
                    resolve();
                })
                .catch(error => console.error('Erreur lors du chargement des questions :', error)
                );

            // Do your async operations here, like fetching data
            // When done, call resolve()
            // If there's an error, call reject()
        });
        
    }
    firstQuestion() {
        this.showQuestion(0);
    }
    showQuestion(index) {
        if (index < 0 || index >= this.$questions.length) {
            return;
        }
        this.$questions[this._currentQuestionIndex].fadeOut('fast',  () => {
            this.$questions[index].fadeIn();
            this._currentQuestionIndex = index;
        });
        this.progressBar.update(index, this.$questions.length);
    }
    nextQuestion() {
        if (!this.validateQuestionAnswered(this._currentQuestionIndex)) {
            $('#error-message').text('Veuillez sélectionner au moins une réponse.');
            $('#error-message').slideDown('fast');
            return true;
        }
        $('#error-message').slideUp('fast');
        if (this._currentQuestionIndex < this.$questions.length - 1) {
            
            this.showQuestion(this._currentQuestionIndex + 1);
            return true;
        }
        else if (this._currentQuestionIndex === this.$questions.length - 1) {
            this.progressBar.update(this.$questions.length, this.$questions.length);
            this.hideQuestionnaire();
            return false;
        }
    }
    showPreviousQuestion() {
        if (this._currentQuestionIndex > 0) {
            this.showQuestion(this._currentQuestionIndex - 1);
        }
    }
    validateQuestionAnswered(index) {
        let isChecked = false;
        this.$questions[index].find('input').each(function () {
            if ($(this).is(':checked')) {
                isChecked = true;
                return false;
            }
        });


        return isChecked;
    }
    isLastQuestion() {
        return this._currentQuestionIndex === this.$questions.length - 1;
    }
    appendQuestionsToContainer() {
        this.$questionnaireContainer.append(this.$questions);
    }
    generateQuestionElement(question, index) {
        const $spectificQuestionDiv = $('<div></div>', {
            id: 'question-' + index,
            style: 'display: none'
        });

        const $questionContainer = this.generateQuestionText(question, index);

        const $answerContainer = $('<div></div>', {
            class: 'row',
            id: 'answers-' + index
        });

        question.answers.forEach(answer => {
            const $answerDiv = this.generateAnswerElement(answer, index, $answerContainer.attr('id'));
            $answerContainer.append($answerDiv);
        });

        $spectificQuestionDiv.append($questionContainer);
        $spectificQuestionDiv.append($answerContainer);
        return $spectificQuestionDiv;
    }
    generateQuestionText(question, index) {
        const $questionDiv = $('<div></div>');
        const $questionTitle = $('<h5></h5>', {
            class: 'question-title',
            text: 'Question ' + (index + 1)
        });
        const $questionText = $('<p></p>', {
            class: 'lead p',
            text: question.question
        });

        $questionDiv.append($questionTitle);
        $questionDiv.append($questionText);
        return $questionDiv;
    }
    generateAnswerElement(answer, index, answersName) {
        const $inputElement = $('<input>', {
            type: 'checkbox',
            id: answer.id,
            name: answersName,
            autocomplete: 'off',
            class: 'btn-check'
        });

        const $answerDiv = $('<div></div>', {
            class: 'answer col-lg-4'
        });

        const $answerLabel = $('<label></label>', {
            for: answer.id,
            type: 'button',
            class: 'btn btn-outline-primary btn-check-perso'
        });

        const $spanElement = $('<span></span>', {
            text: answer.text
        });

        $answerLabel.append($spanElement);
        $answerDiv.append($inputElement);
        $answerDiv.append($answerLabel);

        $answerDiv.on('touchend', function () {
            setTimeout(function () {
                $answerDiv.blur();
            }, 0);
        });

        return $answerDiv;
    }
    hideQuestionnaire() {
        $('#questions-container').fadeOut('fast');
    }
    showQuestionnaire() {
        $('#questions-container').fadeIn('fast');
    }
    resetQuestions() {
        this._currentQuestionIndex = 0;
        this.firstQuestion();
    }
    hasBegan() {
        return this._currentQuestionIndex > 0;
    }
    fadeOut(...args) {
        this.$questionnaireContainer.fadeOut.apply(this.$questionnaireContainer, args);
    }
    fadeIn(...args) {
        this.$questionnaireContainer.fadeIn.apply(this.$questionnaireContainer, args);
    }

}




/*

let questionArray = [];

//import fetch from 'node-fetch';
// Chargement des questions à partir du fichier JSON
fetch('question_sans_image.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        questionArray = questions.map(generateQuestionElement);
        const $questionnaireContainer = $('#questions-container');
        $questionnaireContainer.append(questionArray);
    })
    .catch(error => console.error('Erreur lors du chargement des questions :', error));

const prefixUrl = '';


let currentQuestionIndex = 0;

function generateQuestionText(question, index) {
    const $questionDiv = $('<div></div>');
    const $questionTitle = $('<h5></h5>', {
        class: 'question-title',
        text: 'Question ' + (index + 1)
    });
    const $questionText = $('<p></p>', {
        class: 'lead p',
        text: question.question
    });

    $questionDiv.append($questionTitle);
    $questionDiv.append($questionText);
    return $questionDiv;
}

function generateImageElement(answer) {
    const imgElement = document.createElement('img');
    imgElement.alt = answer.id;
    answer.imageStatic = answer.image.replace('.gif', '_static.gif');
    imgElement.src = prefixUrl + answer.imageStatic;
    imgElement.setAttribute('animation', 'false');
    return imgElement;

}

function generateAnswerElement(answer, index, answersName) {
    const $inputElement = $('<input>', {
        type: 'checkbox',
        id: answer.id,
        name: answersName,
        autocomplete: 'off',
        class: 'btn-check'
    });

    const $answerDiv = $('<div></div>', {
        class: 'answer col-lg-4'
    });

    const $answerLabel = $('<label></label>', {
        for: answer.id,
        type: 'button',
        class: 'btn btn-outline-primary btn-check-perso'
    });

    const $spanElement = $('<span></span>', {
        text: answer.text
    });

    $answerLabel.append($spanElement);
    $answerDiv.append($inputElement);
    $answerDiv.append($answerLabel);

    $answerDiv.on('touchend', function () {
        setTimeout(function () {
            $answerDiv.blur();
        }, 0);
    });

    return $answerDiv;
}

function generateQuestionElement(question, index) {
    // Element contenant l'ensemble question-réponse : 
    // -- Création de l'élément :
    const $spectificQuestionDiv = $('<div></div>', {
        id: 'question-' + index,
        style: 'display: none'
    });
    
    const $questionContainer = generateQuestionText(question, index);

    // Element contenant les réponses :
    // -- Création de l'élément :
    const $answerContainer = $('<div></div>', {
        class: 'row',
        id: 'answers-' + index
    });
    // -- Remplissage avec les réponses : 
    question.answers.forEach(answer => {
        const $answerDiv = generateAnswerElement(answer, index, $answerContainer.attr('id'));
        $answerContainer.append($answerDiv);
    });

    // Ajout des éléments au DOM
    $spectificQuestionDiv.append($questionContainer);
    $spectificQuestionDiv.append($answerContainer);
    return $spectificQuestionDiv;
}

function validateQuestionAnswered(index) {
    // Get the answer container for the question
    const answerContainer = document.getElementById('answers-' + index);

    const errorMessage = document.getElementById('error-message');
    // Get all the input elements in the answer container
    const inputs = answerContainer.getElementsByTagName('input');

    // Check if at least one checkbox is checked
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            // If a checkbox is checked, hide the error message and return true
            errorMessage.style.display = 'none';
            errorMessage.classList.add('hidden');
            return true;
        }
    }

    // If no checkbox is checked, set a custom validity message
    errorMessage.textContent = 'Veuillez sélectionner au moins une réponse.';
    errorMessage.style.display = 'block';
    setTimeout(function () {
        errorMessage.classList.remove('hidden');
    }, 0);

    // Trigger the form validation
    // If no checkbox is checked, return false
    return false;
}

function goToQuestion(index) {
    const currentQuestionDiv = document.getElementById('question-' + currentQuestionIndex);
    currentQuestionDiv.addEventListener('transitionend', function handleTransitionEnd(event) {
        if (event.target.classList.contains('out')) {
        // Remove the event listener so it only runs once
        currentQuestionDiv.removeEventListener('transitionend', handleTransitionEnd);
        currentQuestionDiv.style.display = 'none';
        showQuestion(index);
        }
    });

    hideQuestion(currentQuestionIndex);
    currentQuestionIndex = index;
}

function hideQuestion(index) {
    const question = document.getElementById('question-' + index);
    question.classList.add('out');
    question.classList.remove('in');
}

function showQuestion(index) {
    const question = document.getElementById('question-' + index);
    question.style.display = 'block';
    setTimeout(function () {
        question.classList.remove('out');
        question.classList.add('in');
    }, 0);
}
*/