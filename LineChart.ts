/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
module SHChart {
    export class LineChart implements GraphElement {

        constructor(public date: Date, public val: number, public prev: LineChart) {
        }

        public getMax(): number {
            return this.val;
        }

        public getMin(): number {
            return this.val;
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void {
        }

        public drop(stage: createjs.Stage) {
        }
    }
} 