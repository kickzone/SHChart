module SHChart {
    /**
    チャート全体
    グラフの集合体
    */
    export class Chart {
        
        private graphs: Array<Graph> = [];
        private stage: createjs.Stage;

        constructor(canvas: HTMLCanvasElement) {
            //stageを作成
            this.stage = new createjs.Stage(canvas);
        }

        /**
        * グラフ追加
        */
        public addGraph(graph: Graph) {
            this.graphs.push(graph);
        }

        public paint(start: Date, end: Date) {
            //グループごとのmin, maxを得る
            var min: Array<number> = [];
            var max: Array<number> = [];
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                for (var j in graph.elements) {
                    var element: GraphElement = graph.elements[j];
                    //期間内のものだけ対象にする
                    if (start <= element.date && element.date <= end) {
                        if (min[graph.group] == undefined || min[graph.group] > element.getMin()) min[graph.group] = element.getMin();
                        if (max[graph.group] == undefined || max[graph.group] < element.getMax()) max[graph.group] = element.getMax();
                    }
                }
            }

            //グラフ描画
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                graph.paint(this.stage, start, end, min[graph.group], max[graph.group]);
            }

            //更新
            this.stage.update();
        }
    }
}