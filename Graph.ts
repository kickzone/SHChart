module SHChart{

    /**
    グラフ1つ分を表すクラス
    */
    export class Graph {
        
        public elements: Array<GraphElement> = [];

        /**
        @param group {number} - グループ番号、min:maxの値の範囲を決める時に使用する。例えば株価と移動平均を同一グループにする、出来高は別グループにする、など。
        @param xmin {number} - x座標の最小値
        @param xmax {number} - x座標の最大値
        @param ymin {number} - y座標の最小値
        @param ymax {number} - y座標の最大値
        */
        constructor(public group: number, public xmin: number, public xmax: number, public ymin: number, public ymax: number) {
        }

        /**
        データ追加
        */
        public addData(element : GraphElement) {
            this.elements.push(element); 
        }

        /**
        描画
        */
        public paint(stage: createjs.Stage, start: Date, end: Date, min: number, max: number) {
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>stage.canvas;

            //範囲内のelementの数
            var validElements: Array<GraphElement> = [];
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.date >= start && element.date <= end) {
                    validElements.push(element);
                }
            }
            if (validElements.length == 0) return;
            //1elementごとの幅を決める
            var xSize: number = (this.xmax - this.xmin) / validElements.length;

            for (var i in validElements) {
                var element: GraphElement = validElements[i];
                //削除
                element.drop(stage);
                if (element.date >= start && element.date <= end) {
                    //描画
                    element.paint(stage, min, max, xSize * i + xSize / 2, xSize, this.xmin, this.xmax, this.ymin, this.ymax);
                }
            }
        }
    }


}