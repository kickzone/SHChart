module SHChart{

    /**
    グラフ1つ分を表すクラス
    */
    export class Graph {
        /**
        全要素
        */
        public elements: Array<GraphElement> = [];
        /**
        現在有効な要素
        */
        public validElements: Array<GraphElement> = [];
        private xrange: XRange;

        /**
        @param group {number} - グループ番号、min:maxの値の範囲を決める時に使用する。例えば株価と移動平均を同一グループにする、出来高は別グループにする、など。
        @param ymin {number} - y座標の最小値
        @param ymax {number} - y座標の最大値
        */
        constructor(public title: string, public group: number, public ymin: number, public ymax: number, public needDash: boolean) {
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
            this.xrange = xrange;
            //まず描画中の要素を削除
            for (var i in this.validElements) {
                this.validElements[i].drop(stage);
            }
            this.validElements = [];

            //有効なelementを決定
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.date >= xrange.start && element.date <= xrange.end) {
                    this.validElements.push(element);
                }
            }
            //描画
            for (var i in this.validElements) {
                var element: GraphElement = this.validElements[i];
                element.paint(stage, min, max, xrange.GetX(element.date), xrange.xsize, xrange.xmin, xrange.xmax, this.ymin, this.ymax);
            }
        }

        /**
        マウス連動情報描画
        */
        public paintMouseInfo(x: number, mi: MouseInfo) {
            var date = this.xrange.getDate(x);
            if (date == null) return;
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.date.getTime() == date.getTime()) {
                    mi.paint(element);
                }
            }
        }

        /**
        情報出力用の文字列を得る GraphElementに尋ねる
        */
        public getInfoStr(date: Date) {
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.date.getTime() == date.getTime()) {
                    return element.infoStr();
                }
            }
            return "";
        }
    }


}