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
        public htn: HTN = HTN.None;

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
        public paint(stage: createjs.Stage, xrange: XRange, min: number, max: number, htn: HTN) {
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
        日足、週足、月足を変換する
        */
        public convertScale(htn: HTN) {
            if (htn == this.htn) return;
            this.htn = htn;
            //展開
            var allElements: Array<GraphElement> = [];
            for (var i in this.elements) {
                var elements: Array<GraphElement> = this.elements[i].getAllElements();
                for (var j in elements) {
                    allElements.push(elements[j]);
                }
            }
            //日、週、月にまとめる
            var prevElement: GraphElement;
            var currentElement: GraphElement;
            this.elements = [];
            switch (htn) {
                case HTN.Hiashi:
                    for (var i in allElements) {
                        currentElement = allElements[i];
                        currentElement.initElements();
                        this.elements.push(currentElement);
                        //折れ線グラフ対応
                        var l: any = currentElement;
                        if (l.prev) {
                            l.prev = prevElement;
                        }
                        prevElement = currentElement;
                    }
                    break;
                case HTN.Shuashi:
                case HTN.Tsukiashi:
                    currentElement = allElements[0];
                    currentElement.initElements();
                    this.elements.push(currentElement);
                    prevElement = currentElement;
                    for (var i in allElements) {
                        if (i == 0) continue;
                        var thisElement = allElements[i];
                        var stChange = false;
                        switch (htn) {
                            case HTN.Shuashi:
                                //週が変わった
                                if (prevElement.date.getDay() >= thisElement.date.getDay()) stChange = true;
                                break;
                            case HTN.Tsukiashi:
                                //月が変わった
                                if (prevElement.date.getMonth() < thisElement.date.getMonth()
                                    || prevElement.date.getFullYear() < thisElement.date.getFullYear()) stChange = true;
                                break;
                        }
                        if (stChange) {
                            //折れ線グラフ対応
                            var l: any = currentElement;
                            if (l.prev && this.elements.length > 1) {
                                l.prev = this.elements[this.elements.length - 2];
                            }
                            currentElement = thisElement;
                            currentElement.initElements();
                            this.elements.push(currentElement);
                        }
                        else {
                            currentElement.addElement(thisElement);
                        }
                        prevElement = thisElement;
                    }
                    break;
            }
        }

        /**
        マウス連動情報描画
        */
        public paintMouseInfo(x: number, mi: MouseInfo) {
            var date: Date = this.xrange.getDate(x);
            if (!date) return;
            var dateNum = date.getTime();
            if (date == null) return;
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.dateNum == dateNum) {
                    mi.paint(element);
                }
            }
        }

        /**
        情報出力用の文字列を得る GraphElementに尋ねる
        */
        public getInfoStr(date: Date) {
            var dateNum = date.getTime();
            for (var i in this.elements) {
                var element: GraphElement = this.elements[i];
                if (element.dateNum == dateNum) {
                    return element.infoStr();
                }
            }
            return "";
        }
    }


}