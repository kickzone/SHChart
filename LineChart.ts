/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
module SHChart {
    /**
    折れ線グラフ
    */
    export class LineChart implements GraphElement {

        private line: createjs.Shape;

        constructor(public date: Date, public val: number, public color: string, public prev: LineChart) {
        }

        public getMax(): number {
            return this.val;
        }

        public getMin(): number {
            return this.val;
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void {
            //直前の要素が設定されていなければ、線が引けないので何もしない
            if (!this.prev) return;
            var prevX = x - width;
            var thisY = ymin + (ymax - ymin) * ((max - this.val) / (max - min));
            var prevY = ymin + (ymax - ymin) * ((max - this.prev.val) / (max - min));
            var g: createjs.Graphics = new createjs.Graphics();
            //ToDo:色の変更
            g.beginStroke(this.color)
                .moveTo(prevX, prevY)
                .lineTo(x, thisY)
                .closePath();
            this.line = new createjs.Shape(g);
            stage.addChild(this.line);
        }

        public drop(stage: createjs.Stage) {
            stage.removeChild(this.line);
        }

        public static InputGraphByDateVal(aDv: Array<DateVal>, color: string, graph: Graph): void {
            var prevLc: LineChart;
            for (var i in aDv) {
                var dv: SHChart.DateVal = aDv[i];
                var lc: SHChart.LineChart = new SHChart.LineChart(dv.date, dv.val, color, prevLc);
                prevLc = lc;
                graph.addData(lc);
            }
        }
    }
} 