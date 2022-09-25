import {Path, Svg, SVG, Text} from "@svgdotjs/svg.js";

import 'normalize.css';
import '../css/style.css';
import {Clock} from "./Clock";

class Main {

    static async start() {
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';

        const svg = SVG()
            .addTo(wrapper)
            .size('100%', '100%')
            .viewbox(0, 0, 200, 200);

        const clock = new Clock(svg);

        document.body.appendChild(wrapper);
    }

}

Main.start();