module SHChart {
    /**
    X軸を表す
    */
    export class XAxis {
        /**
        x軸本体
        */
        private axis: createjs.Shape;
        /**
        現在有効な目盛
        */
        private scales: Array<XAxisScale>;

        /**
        解像度決定用テーブル
        ～30日 1週毎 ～6本
        31～50日 2週毎 3～6本
        51～100日 1月毎 3～6本
        101～150日 2月毎 3～5本
        151～250日 3月毎 3～6本
        251～500日 6月毎 3～6本？
        501日～    1年毎
        */
        private SCALE_TABLE: Array<ScaleTable> = [
            { rangeMin: 0, rangeMax: 30, wm: 1, interval: 1 },
            { rangeMin: 31, rangeMax: 50, wm: 1, interval: 2 },
            { rangeMin: 51, rangeMax: 150, wm: 2, interval: 1 },
            { rangeMin: 151, rangeMax: 200, wm: 2, interval: 2 },
            { rangeMin: 201, rangeMax: 500, wm: 2, interval: 3 },
            { rangeMin: 501, rangeMax: 1000, wm: 2, interval: 6 },
            { rangeMin: 1001, rangeMax: 2000, wm: 2, interval: 12 },
            { rangeMin: 2001, rangeMax: 99999, wm: 2, interval: 24 },
        ]; 

        constructor(public xmin: number, public xmax: number, public y: number) {
        }

        /**
        目盛に使用する日付一覧をゲット
        */
        private DecideScale(xrange: XRange): Array<Date> {
            //どの解像度を使うか決定する
            var st: ScaleTable;
            for (var i in this.SCALE_TABLE) {
                if (this.SCALE_TABLE[i].rangeMin <= xrange.trueDateNum && xrange.trueDateNum <= this.SCALE_TABLE[i].rangeMax) {
                    st = this.SCALE_TABLE[i];
                    break;
                }
            }

            var ret: Array<Date> = [];
            var prevDate: Date;
            var currentInterval = 0;
            for (var i in xrange.dates) {
                var date = xrange.dates[i];
                if (!prevDate) {
                    prevDate = date;
                    continue;
                }
                if (st.wm == 1) {
                    //週ごと
                    if (prevDate.getDay() > date.getDay()) currentInterval++;
                } else if (st.wm == 2) {
                    //月ごと
                    if (prevDate.getMonth() != date.getMonth()) currentInterval++;
                }
                //解像度に達したら、目盛を追加
                if (currentInterval == st.interval) {
                    ret.push(date);
                    currentInterval = 0;
                }
                prevDate = date;
            }

            return ret;
        }

        /**
        描画
        */
        public paint(stage: createjs.Stage, xrange: XRange) {
            //x軸を描いていなければ作成する
            if (!this.axis) {
                var g: createjs.Graphics = new createjs.Graphics();
                //ToDo:色の変更
                g.beginStroke("#000000")
                    .moveTo(this.xmin, this.y)
                    .lineTo(this.xmax, this.y)
                    .closePath();
                this.axis = new createjs.Shape(g);
                stage.addChild(this.axis);
            }
            //まず描画済みのscaleをdropしてクリア
            for (var i in this.scales) {
                this.scales[i].drop(stage);
            }
            this.scales = [];
            //作成するscalesを決定、描画
            var scaleDates: Array<Date> = this.DecideScale(xrange);
            for (var i in scaleDates) {
                var date: Date = scaleDates[i];
                //ToDo: 100をどこかで決定する必要がある
                var scale: XAxisScale = new XAxisScale(xrange.GetX(date), 100, this.y, date);
                scale.paint(stage);
                this.scales.push(scale);
            }
        }
    }

    interface ScaleTable {
        rangeMin: number;
        rangeMax: number;
        wm: number;
        interval: number;

    }

} 