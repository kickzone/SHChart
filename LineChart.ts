/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
module SHChart {
    /**
    折れ線グラフ
    */
    export class LineChart implements GraphElement {

        private line: createjs.Shape;

        private paintX: number;
        private paintY: number;

        private allElements: Array<LineChart> = [];
        public dateNum: number;

        constructor(private parent: Graph, public date: Date, public val: number, public color: string, public prev: LineChart) {
            this.dateNum = date.getTime();
            this.allElements.push(this);
        }

        public getMax(): number {
            return this.val;
        }

        public getMin(): number {
            return this.val;
        }

        public getVal(): number {
            return this.allElements[this.allElements.length - 1].val;
        }

        public getX(): number {
            return this.paintX;
        }

        public getY(): number {
            return this.paintY;
        }

        public getAllElements(): Array<GraphElement> {
            return this.allElements;
        }

        public initElements() {
            this.allElements = [];
            this.allElements.push(this);
        }

        public addElement(element: GraphElement) {
            var line = <LineChart>element;
            this.allElements.push(line);
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void {
            //直前の要素が設定されていなければ、線が引けないので何もしない
            if (!this.prev) return;
            var prevX = x - width;
            var thisY = ymin + (ymax - ymin) * ((max - this.getVal()) / (max - min));
            var prevY = ymin + (ymax - ymin) * ((max - this.prev.getVal()) / (max - min));
            this.paintX = x;
            this.paintY = thisY;
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

        public needDash(): boolean {
            return this.parent.needDash;
        }

        public infoStr(): string {
            var retStr: string;
            retStr = this.parent.title + ": " + this.val.toString();
            return retStr;
        }

        public getParent(): Graph {
            return this.parent;
        }


        public static InputGraphByDateVal(aDv: Array<DateVal>, color: string, graph: Graph): void {
            var prevLc: LineChart;
            for (var i in aDv) {
                var dv: SHChart.DateVal = aDv[i];
                var lc: SHChart.LineChart = new SHChart.LineChart(graph, dv.date, dv.val, color, prevLc);
                prevLc = lc;
                graph.addData(lc);
            }
        }

        public static InputGraphByHiashi(aDv: Array<Hiashi>, color: string, graph: Graph): void {
            var prevLc: LineChart;
            for (var i in aDv) {
                var dv: SHChart.Hiashi = aDv[i];
                var lc: SHChart.LineChart = new SHChart.LineChart(graph, new Date(dv.ymd), Number(dv.close), color, prevLc);
                prevLc = lc;
                graph.addData(lc);
            }
        }
    }
} 