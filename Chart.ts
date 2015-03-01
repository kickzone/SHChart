module SHChart {
    /**
    チャート全体
    グラフの集合体
    */
    export class Chart {
        
        private graphs: Array<Graph> = [];
        private xaxis: XAxis;
        private yaxis: YAxis;
        private stage: createjs.Stage;
        private XAXIS_GAP: number = 100;
        private YAXIS_GAP: number = 100;

        constructor(canvas: HTMLCanvasElement) {
            //stageを作成
            this.stage = new createjs.Stage(canvas);
            this.xaxis = new XAxis(0, canvas.width - this.YAXIS_GAP, canvas.height - this.XAXIS_GAP);
            //ToDo:100、を他の場所で決定するべき
            this.yaxis = new YAxis(canvas.width - this.YAXIS_GAP, 100, canvas.height - this.XAXIS_GAP);
        }

        /**
        * グラフ追加
        */
        public addGraph(graph: Graph) {
            this.graphs.push(graph);
        }

        public paint(start: Date, end: Date) {
            //グループごとのmin, maxを得る
            //全グラフから範囲内の日付の配列も得る
            var min: Array<number> = [];
            var max: Array<number> = [];
            var dates: Array<Date> = [];
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                for (var j in graph.elements) {
                    var element: GraphElement = graph.elements[j];
                    //期間内のものだけ対象にする
                    if (start <= element.date && element.date <= end) {
                        if (min[graph.group] == undefined || min[graph.group] > element.getMin()) min[graph.group] = element.getMin();
                        if (max[graph.group] == undefined || max[graph.group] < element.getMax()) max[graph.group] = element.getMax();
                        var bFindDate: boolean = false;
                        for (var j in dates) {
                            if (element.date.getTime() == dates[j].getTime()) {
                                bFindDate = true;
                                break;
                            }
                        }
                        if (!bFindDate) dates.push(element.date);
                    }
                }
            }
            dates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>this.stage.canvas;
            var xrange: XRange = new XRange(dates, 0, canvas.width - this.YAXIS_GAP);

            //X軸描画
            this.xaxis.paint(this.stage, xrange);
            //Y軸描画
            //ToDo:minとmaxの取得方法
            this.yaxis.paint(this.stage, min[1], max[1]);

            //グラフ描画
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                graph.paint(this.stage, xrange, min[graph.group], max[graph.group]);
            }


            //更新
            this.stage.update();
        }
    }
}