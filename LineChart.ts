/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
module SHChart {
    export class LineChart implements GraphElement {

        constructor(public date: Date, public val: number, public color: string, public prev: LineChart) {
        }

        public getMax(): number {
            return this.val;
        }

        public getMin(): number {
            return this.val;
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void {
            var prevX = x - width;
            var thisY = ymin + (ymax - ymin) * ((max - this.val) / (max - min));
            var prevY = ymin + (ymax - ymin) * ((max - this.prev.val) / (max - min));
        }

        public drop(stage: createjs.Stage) {
        }
    }
} 