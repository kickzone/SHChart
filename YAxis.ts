module SHChart {
    /**
    Y軸を表す
    */
    export class YAxis {
        /**
        Y軸本体
        */
        private axis: createjs.Shape;
        /**
        現在有効な目盛
        */
        private scales: Array<YAxisScale>;

        /**
        Y軸目盛の目安本数
        */
        private YAXIS_BASE_NUM: number = 4;


        constructor(public x: number, public ymin: number, public ymax: number) {
        }

        /**
        目盛に使用する数値一覧を算出
        */
        private DecideScale(min: number, max: number): Array<number> {
            //数値の幅を目安本数で割って、大体の間隔を算出
            var range: number = max - min;
            var intervalBase: number = range / this.YAXIS_BASE_NUM;
            //キリのいい数に揃える 22→20、158→200など
            var keta: number = Math.floor(Math.log(intervalBase) / Math.log(10) + 1);
            var interval: number = Math.round(intervalBase / Math.pow(10, keta - 1)) * Math.pow(10, keta - 1);

            //intervalで割り切れる数を返す
            var minBase = Math.ceil(min / interval);
            var maxBase = Math.floor(max / interval);
            var ret: Array<number> = [];
            for (var i: number = minBase; i <= maxBase; i++) {
                ret.push(i * interval);
            }
            return ret;
        }

        /**
        描画
        */
        public paint(stage: createjs.Stage, min: number, max: number) {
            //Y軸を描いていなければ作成する
            if (!this.axis) {
                var g: createjs.Graphics = new createjs.Graphics();
                //ToDo:色の変更
                g.beginStroke("#000000")
                    .moveTo(this.x, this.ymin)
                    .lineTo(this.x, this.ymax)
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
            var scaleNumbers: Array<number> = this.DecideScale(min, max);
            for (var i in scaleNumbers) {
                var num: number = scaleNumbers[i];
                var y = this.ymin + (this.ymax - this.ymin) * ((max - num) / (max - min));
                var scale: YAxisScale = new YAxisScale(0, this.x, y, num);
                scale.paint(stage);
                this.scales.push(scale);
            }
        }
    }

}  