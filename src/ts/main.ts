import {SVG} from "@svgdotjs/svg.js";

import 'normalize.css';
import '../css/style.css';
import {Clock} from "./Clock";

class Main {

    static async start() {
        const wrapper = document.createElement('main');
        wrapper.className = 'wrapper';

        const svgWrapper = document.createElement('div')
        svgWrapper.className = 'svg-wrapper';

        const svg = SVG()
            .addTo(svgWrapper)
            .size('100%', '100%')
            .viewbox(0, 0, 200, 200);

        const clock = new Clock(svg);

        const menuWrapper = Main.createMenu(clock);

        wrapper.appendChild(menuWrapper)
        wrapper.appendChild(svgWrapper);

        document.body.appendChild(wrapper);
    }

    private static createMenu(clock: Clock) {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu';

        const radioBtnZeitEchtzeit = document.createElement('input');
        radioBtnZeitEchtzeit.type = 'radio';
        radioBtnZeitEchtzeit.id = 'radioBtnEchtzeit';
        radioBtnZeitEchtzeit.name = 'radioBtnZeit';
        radioBtnZeitEchtzeit.checked = true;

        const radioBtnZeitEchtzeitLbl = document.createElement('label');
        radioBtnZeitEchtzeitLbl.textContent = 'Zeige Echtzeit'
        radioBtnZeitEchtzeitLbl.htmlFor = radioBtnZeitEchtzeit.id;

        const radioBtnZeitSimuliert = document.createElement('input');
        radioBtnZeitSimuliert.type = 'radio';
        radioBtnZeitSimuliert.id = 'radioBtnSimuliert';
        radioBtnZeitSimuliert.name = 'radioBtnZeit';
        radioBtnZeitSimuliert.checked = true;

        const radioBtnZeitSimuliertLbl = document.createElement('label');
        radioBtnZeitSimuliertLbl.textContent = 'Zeige simulierte Zeit'
        radioBtnZeitSimuliertLbl.htmlFor = radioBtnZeitSimuliert.id;

        const radioBtnEchtzeitDiv = document.createElement('div');
        radioBtnEchtzeitDiv.appendChild(radioBtnZeitEchtzeit);
        radioBtnEchtzeitDiv.appendChild(radioBtnZeitEchtzeitLbl);
        menuDiv.appendChild(radioBtnEchtzeitDiv);

        const radioBtnSimuliertDiv = document.createElement('div');
        radioBtnSimuliertDiv.appendChild(radioBtnZeitSimuliert);
        radioBtnSimuliertDiv.appendChild(radioBtnZeitSimuliertLbl);
        menuDiv.appendChild(radioBtnSimuliertDiv);

        const timeInputDiv = document.createElement('div');
        timeInputDiv.className = 'time-input';

        const hourInput = document.createElement('input');
        hourInput.type = 'number';
        hourInput.value = '00';
        hourInput.min = '0';
        hourInput.max = '23';
        hourInput.disabled = true;

        const colonSpan1 = document.createElement('span');
        colonSpan1.textContent = ':';

        const minuteInput = document.createElement('input');
        minuteInput.type = 'number';
        minuteInput.value = '00';
        minuteInput.min = '0';
        minuteInput.max = '59';
        minuteInput.disabled = true;

        const colonSpan2 = document.createElement('span');
        colonSpan2.textContent = ':';

        const secondInput = document.createElement('input');
        secondInput.type = 'number';
        secondInput.value = '00';
        secondInput.min = '0';
        secondInput.max = '59';
        secondInput.disabled = true;

        timeInputDiv.appendChild(hourInput);
        timeInputDiv.appendChild(colonSpan1);
        timeInputDiv.appendChild(minuteInput);
        timeInputDiv.appendChild(colonSpan2);
        timeInputDiv.appendChild(secondInput);

        menuDiv.appendChild(timeInputDiv);

        menuDiv.appendChild(document.createElement('hr'));

        const checkboxDigitalZeit = document.createElement('input');
        checkboxDigitalZeit.type = 'checkbox';
        checkboxDigitalZeit.id = 'checkboxDigitalZeit';
        checkboxDigitalZeit.checked = true;
        checkboxDigitalZeit.onclick = () => clock.setClockDisplayVisible(checkboxDigitalZeit.checked);

        const labelDigitalZeit = document.createElement('label');
        labelDigitalZeit.textContent = 'Zeige Digitaluhr';
        labelDigitalZeit.htmlFor = checkboxDigitalZeit.id;

        const divDigitalZeit = document.createElement('div');
        divDigitalZeit.appendChild(checkboxDigitalZeit);
        divDigitalZeit.appendChild(labelDigitalZeit);

        const checkboxStundenZiffern = document.createElement('input');
        checkboxStundenZiffern.type = 'checkbox';
        checkboxStundenZiffern.id = 'checkboxStundenZiffern';
        checkboxStundenZiffern.checked = true;
        checkboxStundenZiffern.onclick = () => clock.setHourTextsVisible(checkboxStundenZiffern.checked);

        const labelStundenZiffern = document.createElement('label');
        labelStundenZiffern.textContent = 'Zeige Ziffern';
        labelStundenZiffern.htmlFor = checkboxStundenZiffern.id;

        const divStundenZiffern = document.createElement('div');
        divStundenZiffern.appendChild(checkboxStundenZiffern);
        divStundenZiffern.appendChild(labelStundenZiffern);

        menuDiv.appendChild(divDigitalZeit);
        menuDiv.appendChild(divStundenZiffern);

        return menuDiv;
    }


}

Main.start();