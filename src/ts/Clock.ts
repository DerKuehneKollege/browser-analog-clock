import {Circle, Path, Svg, Text} from "@svgdotjs/svg.js";

export class Clock {

    private static readonly SECONDS_PER_MINUTE = 60;
    private static readonly SECONDS_PER_HOUR = Clock.SECONDS_PER_MINUTE * 60;
    private static readonly SECONDS_PER_HALF_DAY = Clock.SECONDS_PER_HOUR * 12;

    private static readonly UPDATE_RATE_MS = 1000;

    private static readonly RADIUS = 100;
    private static readonly HOUR_HANDLE_LENGTH = 40;
    private static readonly MINUTE_HANDLE_LENGTH = 60;
    private static readonly SECOND_HANDLE_LENGTH = 80;

    private static readonly TICK_ANGLE_IN_RAD = (2 * Math.PI) / Clock.SECONDS_PER_MINUTE;
    private static readonly SECONDS_ANGLE_IN_RAD = (2 * Math.PI) / Clock.SECONDS_PER_MINUTE;
    private static readonly MINUTES_ANGLE_IN_RAD = (2 * Math.PI) / Clock.SECONDS_PER_HOUR;
    private static readonly HOUR_ANGLE_IN_RAD = (2 * Math.PI) / Clock.SECONDS_PER_HALF_DAY;
    private static readonly HOUR_TEXT_ANGLE = (2 * Math.PI) / 12;

    private readonly svg: Svg;

    private hourHandleElem?: Path;
    private minuteHandleElem?: Path;
    private secondHandleElem?: Path;
    private clockDisplayText?: Text;
    private secondHandCircle?: Circle;

    constructor(svg: Svg) {
        this.svg = svg;

        this.renderStatic();

        this.update();
        setInterval(() => this.update(), Clock.UPDATE_RATE_MS);
    }

    private renderStatic() {
        const tickLength = 10;

        for (let i = 0; i < Clock.SECONDS_PER_MINUTE; i++) {
            const angleInRad = i * Clock.TICK_ANGLE_IN_RAD;

            const tickLength = (i % 5 == 0) ? 8 : 5;

            const xNormalized = Math.sin(angleInRad);
            const yNormalized = -Math.cos(angleInRad);

            const x1 = xNormalized * (Clock.RADIUS - tickLength);
            const y1 = yNormalized * (Clock.RADIUS - tickLength);

            const x2 = xNormalized * tickLength;
            const y2 = yNormalized * tickLength;

            this.svg
                .path(`M${Clock.RADIUS},${Clock.RADIUS} m${x1},${y1} l${x2},${y2}`)
                .fill('none')
                .stroke((i % 15 == 0) ? 'red' : 'black');
        }

        for (let i = 0; i < 12; i++) {
            const angleInRad = i * Clock.HOUR_TEXT_ANGLE;

            const hourTextX = Math.sin(angleInRad) * 80 + Clock.RADIUS;
            const hourTextY = -Math.cos(angleInRad) * 80 + Clock.RADIUS;

            const hourText = (i == 0 ? 12 : i).toString();

            this.svg.text(hourText).center(hourTextX, hourTextY);
        }

        // this.svg
        //     .circle()
        //     .fill('none')
        //     .stroke('black')
        //     .radius(Clock.RADIUS, Clock.RADIUS)
        //     .center(Clock.RADIUS, Clock.RADIUS);
    }

    private update() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // const hours = 0;
        // const minutes = 30;
        // const seconds = 0;

        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        const secondHandAngle = seconds * Clock.SECONDS_ANGLE_IN_RAD;
        const minuteHandAngle = (minutes * Clock.SECONDS_PER_MINUTE + seconds) * Clock.MINUTES_ANGLE_IN_RAD;
        const hourHandAngle = ((hours % 12) * Clock.SECONDS_PER_HOUR + minutes * Clock.SECONDS_PER_MINUTE + seconds) * Clock.HOUR_ANGLE_IN_RAD;

        const secondHandX = Math.sin(secondHandAngle) * Clock.SECOND_HANDLE_LENGTH;
        const secondHandY = -Math.cos(secondHandAngle) * Clock.SECOND_HANDLE_LENGTH;

        const minuteHandX = Math.sin(minuteHandAngle) * Clock.MINUTE_HANDLE_LENGTH;
        const minuteHandY = -Math.cos(minuteHandAngle) * Clock.MINUTE_HANDLE_LENGTH;

        const hourHandX = Math.sin(hourHandAngle) * Clock.HOUR_HANDLE_LENGTH;
        const hourHandY = -Math.cos(hourHandAngle) * Clock.HOUR_HANDLE_LENGTH;

        if (!this.clockDisplayText) {
            this.clockDisplayText = this.svg.text(`12:34:56`)
                .fill('gray')
                .center(Clock.RADIUS, Clock.RADIUS + 20);
        }

        this.clockDisplayText.text(`${hoursStr}:${minutesStr}:${secondsStr}`);

        if (this.hourHandleElem) {
            this.hourHandleElem.remove();
        }

        this.hourHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${hourHandX},${hourHandY}`)
            .fill('none')
            .stroke({ color: 'black', width: 3});

        if (this.minuteHandleElem) {
            this.minuteHandleElem.remove();
        }

        this.minuteHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${minuteHandX},${minuteHandY}`)
            .fill('none')
            .stroke({ color: 'black', width: 2});

        if (this.secondHandleElem) {
            this.secondHandleElem.remove();
        }

        this.secondHandleElem = this.svg
            .path(`M${Clock.RADIUS},${Clock.RADIUS} l${secondHandX},${secondHandY}`)
            .fill('none')
            .stroke('red');

        if (this.secondHandCircle) {
            this.secondHandCircle.remove();
        }

        this.secondHandCircle = this.svg.circle(10).center(100, 100).fill('red');
    }

}