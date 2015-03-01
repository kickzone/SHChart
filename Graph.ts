module SHChart{

    /**
    グラフ1つ分を表すクラス
    */
    export class Graph {
        
        public elements: Array<GraphElement> = [];

        /**
        @param group {number} - グループ番号、min:maxの値の範囲を決める時に使用する。例えば株価と移動平均を同一グループにする、出来高は別グループにする、など。
        @param ymin {number} - y座標の最小値
        @param ymax {number} - y座標の最大値
        */
        constructor(public group: number, public ymin: number, public ymax: number) {
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
        public paint(stage: createjs.Stage, xrange: XRange, min: number, max: number) {
            //範囲内のelementの数
            var validElements: Array<GraphElement> = [];
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.date >= xrange.start && element.date <= xrange.end) {
                    validElements.push(element);
                }
            }
            for (var i in validElements) {
                var element: GraphElement = validElements[i];
                //削除
                element.drop(stage);
                //描画
                element.paint(stage, min, max, xrange.GetX(element.date), xrange.xsize, xrange.xmin, xrange.xmax, this.ymin, this.ymax);
            }
        }
    }


}