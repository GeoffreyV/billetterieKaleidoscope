// Version: 1.0

function parseColor(color) {
    let match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
    return match ? match.slice(1, 4).map(Number) : null;
}

class Slider {
    constructor(prefixUrl, jsonFileName, $parentContainer) {
        this.$explanationsArray = [];
        this.jsonData = {};
        this.$parentContainer = $(`#${$parentContainer}`); // jQuery
        this.prefixUrl = prefixUrl;
        this.jsonFileName = jsonFileName;
        this.$bubleEuro = $('#bubleEuro');
        this.buble = this.$parentContainer.find('#buble');
        this.buble.bubleText = this.$parentContainer.find('#bubleText');
        this.$explanationDiv = this.$parentContainer.find('#prices-explanation');
        this.$slider = this.$parentContainer.find('#myRange');
        this.thumbWidth = 14;


        this.colorsSlider = [
            { position: 0, color: parseColor(this.$slider.css('--color1')) },
            { position: 0.30, color: parseColor(this.$slider.css('--color2')) },
            { position: 0.51, color: parseColor(this.$slider.css('--color3')) },
            { position: 0.80, color: parseColor(this.$slider.css('--color4')) },
            { position: 1, color: parseColor(this.$slider.css('--color5')) }
        ];

    }

    async initialize() {
        const response = await fetch(this.prefixUrl + this.jsonFileName);
        const data = await response.json();
        this.jsonData = data.tarifs;
        this.render();
    }

    render() {
        this.jsonData.forEach((tarif, index) => {
            const $tarifElement = $('<div>', {
                id: tarif.id,
                class: 'textPerso inactive',
                click: () => { this.updatePrice(tarif.price); }
            });
            const $h5Element = $('<h5>');
            const $spanElement = $('<span>', {
                class: 'priceTag',
                style: `color: rgb(${this.colorsSlider[index].color})`
            });
            let $textNode;
            if (tarif.min != tarif.max) {
                $textNode = $(`<span>${tarif.min} -- ${tarif.max} €</span>`);
            }
            else {
                $textNode = $(`<span>${tarif.min} €</span>`);
            }
            $spanElement.append($textNode);
            $h5Element.append($spanElement);
            $tarifElement.append($h5Element);
            $tarifElement.append(tarif.description);
            this.$explanationsArray.push($tarifElement);
        });
        this.$slider.on('input', () => {
            this.updatePrice(this.$slider.val());
        });
        this.$explanationDiv.append(this.$explanationsArray);
        this.updatePrice(175);
        this.$parentContainer.fadeIn('fast');


    }



    updatePrice(x_price) {
        const price = this.validatePrice(x_price);
        this.$slider.val(price);
        const thumbColor = this.updateThumbColor();
        this.updateBuble(thumbColor);
        this.updateDescription(price);
        this.adjustSparkleIntensity(price);

    }

    validatePrice(price) {
        for (var i = 0; i < this.jsonData.length; i++) {
            if (this.jsonData[i].min === this.jsonData[i].max && (i < this.$explanationsArray.length - 1) && price < this.jsonData[i + 1].min && price >= this.jsonData[i].min) {
                return this.jsonData[i].price;
            }
        }
        return price;
    }

    updateDescription(price) {
        for (var i = 0; i < this.$explanationsArray.length; i++) {
            if (price >= this.jsonData[i].min && price <= this.jsonData[i].max) {
                this.$explanationsArray[i].removeClass('inactive');
                this.$explanationsArray[i].addClass('active');
            }
            else {
                this.$explanationsArray[i].removeClass('active');
                this.$explanationsArray[i].addClass('inactive');
            }
        }
    }

    adjustSparkleIntensity(value) {
        // Ajustez la durée de l'animation en fonction de la valeur
        if (value >= this.jsonData[this.jsonData.length - 1].min && value < this.jsonData[this.jsonData.length - 1].max) {
            const minValue = value - this.jsonData[this.jsonData.length - 1].min;
            const maxValue = this.jsonData[this.jsonData.length - 1].max;
            const minPeriod = 0.5;
            const maxPeriod = 5;
            const animationDuration = ((value - minValue) * (minPeriod - maxPeriod) / (maxValue - minValue) + maxPeriod) + 's';

            this.buble.css('animation-duration', animationDuration);



            this.addSparkle();
            this.$bubleEuro.fadeIn('fast');
        }
        else if (value == this.jsonData[this.jsonData.length - 1].max) {
            this.loveAnimation();
        }
        else {
            this.removeSparkle();
            this.$bubleEuro.fadeIn('fast');
        }
    }

    loveAnimation() {
        let originalWidth = this.buble.width();
        let originalHeight = this.buble.height();
        $('#bubleEuro').fadeOut('slow');
        this.buble.bubleText.fadeTo('slow', 0, () => {
            this.buble.bubleText.text('Love You');
            this.buble.bubleText.fadeTo('slow', 1);
            /*this.buble.animate({
                left: this.$slider.width() / 2 - this.buble.width() / 2,
            }, 500,  () => {
                this.buble.animate({
                    opacity: 0,
                    width: originalWidth * 2,
                    height: originalHeight * 2,
                });

            });*/
        });



        /*this.buble.removeClass('sparkle');
        this.buble.css('animation-duration', '3s');
        this.$explanationDiv.fadeTo('fast', 0.1);
        this.$slider.fadeTo('fast', 0.1);*/
    }

    turnOffLoveAnimation() {
        
        this.buble.classList.remove('flyAndBurst');
        this.buble.classList.remove('animate');
        this.$explanationDiv.fadeTo('fast', 1);
        this.$slider.fadeTo('fast', 1);
    }

    addSparkle() {
        this.buble.addClass('sparkle');
    }

    removeSparkle() {
        this.buble.removeClass('sparkle');
    }

    updateBuble(color) {
        this.moveBuble();
        this.changeBubleColor(color);
        this.buble.bubleText.text(this.$slider.val());
    }

    moveBuble() {
        const sliderValueRatio = (this.$slider.val() - this.$slider.attr('min')) / (this.$slider.attr('max') - this.$slider.attr('min'));
        const sliderOffset = -this.thumbWidth * sliderValueRatio + this.thumbWidth / 2;
        const thumbCenter = sliderValueRatio * this.$slider.width() + sliderOffset;

        const leftPosition = thumbCenter - this.buble.width() / 2;
        this.buble.stop();
        this.buble.animate({ left: leftPosition + 'px' });
    }

    changeBubleColor(color) {
        this.buble.css('color', 'rgb(' + color.join(', ') + ')');
        this.buble.css('--red', color[0]);
        this.buble.css('--green', color[1]);
        this.buble.css('--blue', color[2]);
    }

    updateThumbColor() {
        const max = this.$slider.attr('max');
        const min = this.$slider.attr('min');
        const value = this.$slider.val();
        const percentage = (value - min) / (max - min);

        // Trouver les deux couleurs entre lesquelles la valeur actuelle se situe
        let color1, color2;
        for (let i = 0; i < this.colorsSlider.length - 1; i++) {
            if (percentage >= this.colorsSlider[i].position && percentage <= this.colorsSlider[i + 1].position) {
                color1 = this.colorsSlider[i];
                color2 = this.colorsSlider[i + 1];
                break;
            }
        }

        // Calculer le pourcentage entre la couleur de départ et de fin
        const colorPercentage = (percentage - color1.position) / (color2.position - color1.position);

        // Calculer la couleur du thumb en fonction du pourcentage
        const thumbColor = color1.color.map((start, i) => Math.round(start + colorPercentage * (color2.color[i] - start)));

        // Appliquer la couleur du thumb
        this.$slider.css('--thumb-color', 'rgb(' + thumbColor.join(',') + ')');
        return thumbColor;
    }



}


