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
        private mi: MouseInfo;
        private canvas: HTMLCanvasElement;
        private info: HTMLDivElement;
        private xrange: XRange;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            //stageを作成
            this.stage = new createjs.Stage(canvas);
            this.xaxis = new XAxis(0, canvas.width - this.YAXIS_GAP, canvas.height - this.XAXIS_GAP);
            //ToDo:100、を他の場所で決定するべき
            this.yaxis = new YAxis(canvas.width - this.YAXIS_GAP, 100, canvas.height - this.XAXIS_GAP);

            //マウスイベント作成
            canvas.addEventListener("mousemove", this.CanvasMouseMove, false);
            this.mi = new MouseInfo(this.stage, 0, canvas.width - this.YAXIS_GAP, 100, canvas.height - this.XAXIS_GAP);
        }

        /**
        * グラフ追加
        */
        public addGraph(graph: Graph) {
            this.graphs.push(graph);
        }

        public setInfo(info: HTMLDivElement) {
            this.info = info;
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
            this.xrange = new XRange(dates, 0, canvas.width - this.YAXIS_GAP);

            //X軸描画
            this.xaxis.paint(this.stage, this.xrange);
            //Y軸描画
            //ToDo:minとmaxの取得方法
            this.yaxis.paint(this.stage, min[1], max[1]);

            //グラフ描画
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                graph.paint(this.stage, this.xrange, min[graph.group], max[graph.group]);
            }


            //更新
            this.stage.update();
        }

        /**
        マウスカーソルに合わせた描画
        */
        CanvasMouseMove = (e: MouseEvent) => {
            this.mi.drop();
            var xCanvas = e.clientX - this.canvas.offsetLeft;
            for (var i in this.graphs) {
                this.graphs[i].paintMouseInfo(xCanvas, this.mi);
            }
            this.stage.update();
            //divタグ用に出力する情報
            if (this.info) {
                this.info.innerHTML = "";
                var date: Date = this.xrange.getDate(xCanvas);
                if (date) {
                    var w = ["日", "月", "火", "水", "木", "金", "土"];
                    var str: string = date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getDate() + "(" + w[date.getDay()] + ")";
                    for (var i in this.graphs) {
                        var graphStr = this.graphs[i].getInfoStr(date);
                        if (graphStr != "") {
                            str += "\n" + graphStr;
                        }
                    }
                    this.info.innerHTML = str;
                }
            }
        }
    }
}