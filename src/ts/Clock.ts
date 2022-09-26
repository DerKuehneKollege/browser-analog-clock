import {Circle, Marker, Path, Svg, Text} from "@svgdotjs/svg.js";

export class Clock {

    private static readonly SECONDS_PER_MINUTE = 60;
    private static readonly MINUTES_PER_HOUR = 60;
    private static readonly SECONDS_PER_HOUR = Clock.SECONDS_PER_MINUTE * Clock.MINUTES_PER_HOUR;

    // "Half day" as the clock face does not have 24 hours but 12
    private static readonly HOURS_PER_HALF_DAY = 12;
    private static readonly SECONDS_PER_HALF_DAY = Clock.SECONDS_PER_HOUR * Clock.HOURS_PER_HALF_DAY;

    // long ticks every LONG_TICK_STEPS steps
    private static readonly LONG_TICK_STEPS = 5;
    
    // quarter tick every QUARTER_TICK_STEPS
    private static readonly QUARTER_TICK_STEPS = 15;
    
    private static readonly SHORT_TICK_LENGTH = 7;
    private static readonly LONG_TICK_LENGTH = 10;

    private static readonly UPDATE_RATE_MS = 1000;

    private static readonly RADIUS = 100;
    private static readonly HOUR_HANDLE_LENGTH = 40;
    private static readonly MINUTE_HANDLE_LENGTH = 60;
    private static readonly SECOND_HANDLE_LENGTH = 80;
    private static readonly HOUR_TEXT_RADIUS = 80;

    private static readonly TWO_PI = 2 * Math.PI;

    private static readonly TICK_ANGLE_IN_RAD = Clock.TWO_PI / Clock.SECONDS_PER_MINUTE;
    private static readonly SECONDS_ANGLE_IN_RAD = Clock.TWO_PI / Clock.SECONDS_PER_MINUTE;
    private static readonly MINUTES_ANGLE_IN_RAD = Clock.TWO_PI / Clock.SECONDS_PER_HOUR;
    private static readonly HOUR_ANGLE_IN_RAD = Clock.TWO_PI / Clock.SECONDS_PER_HALF_DAY;
    private static readonly HOUR_TEXT_ANGLE = Clock.TWO_PI / Clock.HOURS_PER_HALF_DAY;
    
    private static readonly COLOR_NORMAL = 'black';
    private static readonly COLOR_SECOND_HAND = 'red';
    private static readonly COLOR_QUARTER_TICKS = 'red';

    private readonly svg: Svg;

    private readonly roundedMarker: Marker;
    private readonly arrowMarker: Marker;

    private hourHandleElem?: Path;
    private minuteHandleElem?: Path;
    private secondHandleElem?: Path;
    private clockDisplayText?: Text;
    private secondHandCircle?: Circle;

    constructor(svg: Svg) {
        this.svg = svg;

        this.roundedMarker = this.svg.marker(1, 1, (add) => {
            add.circle(1).fill(Clock.COLOR_NORMAL)
        });

        this.arrowMarker = this.svg.marker(10, 10, (add) => {
            add.path('M0,0 L0,6 L9,3 z').cx(5).cy(5).fill(Clock.COLOR_SECOND_HAND)
        });

        this.renderStatic();

        this.update();
        setInterval(() => this.update(), Clock.UPDATE_RATE_MS);
    }

    private renderStatic() {

        for (let i = 0; i < Clock.SECONDS_PER_MINUTE; i++) {
            const angleInRad = i * Clock.TICK_ANGLE_IN_RAD;

            const tickLength = (i % Clock.LONG_TICK_STEPS == 0) 
                ? Clock.LONG_TICK_LENGTH 
                : Clock.SHORT_TICK_LENGTH;

            const xNormalized = Math.sin(angleInRad);
            const yNormalized = -Math.cos(angleInRad);

            const x1 = xNormalized * (Clock.RADIUS - tickLength);
            const y1 = yNormalized * (Clock.RADIUS - tickLength);

            const x2 = xNormalized * tickLength;
            const y2 = yNormalized * tickLength;

            const tickColor = (i % Clock.QUARTER_TICK_STEPS == 0)
                ? Clock.COLOR_QUARTER_TICKS
                : Clock.COLOR_NORMAL;

            const tickWidth = (i % Clock.LONG_TICK_STEPS == 0)
                ? 2
                : 1;

            this.svg
                .path(`M${Clock.RADIUS},${Clock.RADIUS} m${x1},${y1} l${x2},${y2}`)
                .fill('none')
                .stroke({ color: tickColor, width: tickWidth });
        }

        for (let i = 0; i < 12; i++) {
            const angleInRad = i * Clock.HOUR_TEXT_ANGLE;

            const hourTextX = Math.sin(angleInRad) * Clock.HOUR_TEXT_RADIUS + Clock.RADIUS;
            const hourTextY = -Math.cos(angleInRad) * Clock.HOUR_TEXT_RADIUS + Clock.RADIUS;

            // there is no 0, only 12 o'clock
            const hourText = (i == 0 ? 12 : i).toString();

            this.svg
                .text(hourText)
                // .font('family', 'JetBrains Mono')
                .center(hourTextX, hourTextY);
        }

        this.svg
            .circle()
            .fill('none')
            .stroke({ color: Clock.COLOR_NORMAL, width: 2 })
            .radius(Clock.RADIUS-1, Clock.RADIUS-1)
            .center(Clock.RADIUS, Clock.RADIUS);
    }

    private update() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        const secondHandAngle = seconds * Clock.SECONDS_ANGLE_IN_RAD;
        const minuteHandAngle = (minutes * Clock.SECONDS_PER_MINUTE + seconds) * Clock.MINUTES_ANGLE_IN_RAD;
        const hourHandAngle = ((hours % Clock.HOURS_PER_HALF_DAY)
            * Clock.SECONDS_PER_HOUR + minutes
            * Clock.SECONDS_PER_MINUTE + seconds)
            * Clock.HOUR_ANGLE_IN_RAD;

        const secondHandX = Math.sin(secondHandAngle) * Clock.SECOND_HANDLE_LENGTH;
        const secondHandY = -Math.cos(secondHandAngle) * Clock.SECOND_HANDLE_LENGTH;

        const minuteHandX = Math.sin(minuteHandAngle) * Clock.MINUTE_HANDLE_LENGTH;
        const minuteHandY = -Math.cos(minuteHandAngle) * Clock.MINUTE_HANDLE_LENGTH;

        const hourHandX = Math.sin(hourHandAngle) * Clock.HOUR_HANDLE_LENGTH;
        const hourHandY = -Math.cos(hourHandAngle) * Clock.HOUR_HANDLE_LENGTH;

        if (!this.clockDisplayText) {
            this.clockDisplayText = this.svg.text('12:34:56')
                .fill('gray')
                .font('family', 'JetBrains Mono')
                .center(Clock.RADIUS, Clock.RADIUS + 20);
        }

        this.clockDisplayText.text(`${hoursStr}:${minutesStr}:${secondsStr}`);

        if (this.hourHandleElem) {
            this.hourHandleElem.remove();
        }

        this.hourHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${hourHandX},${hourHandY}`)
            .fill('none')
            .stroke({ color: Clock.COLOR_NORMAL, width: 3})
            .marker('end', this.roundedMarker);

        if (this.minuteHandleElem) {
            this.minuteHandleElem.remove();
        }

        this.minuteHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${minuteHandX},${minuteHandY}`)
            .fill('none')
            .stroke({ color: Clock.COLOR_NORMAL, width: 2})
            .marker('end', this.roundedMarker);

        if (this.secondHandleElem) {
            this.secondHandleElem.remove();
        }

        this.secondHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${secondHandX},${secondHandY}`)
            .fill('none')
            .stroke(Clock.COLOR_SECOND_HAND);
            // .marker('end', this.arrowMarker);

        if (this.secondHandCircle) {
            this.secondHandCircle.remove();
        }

        this.secondHandCircle = this.svg.circle(10).center(100, 100).fill(Clock.COLOR_SECOND_HAND);
    }

}