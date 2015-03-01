module SHChart {
    /**
    Y軸の目盛1つ分
    */
    export class YAxisScale {
        /**
        目盛本体
        */
        private axisScale: createjs.Shape;
        /**
        文字(数値)
        */
        private textScale: createjs.Text;

        constructor(public xmin: number, public xmax: number, public y: number, public num: number) {
        }

        public drop(stage: createjs.Stage) {
            stage.removeChild(this.axisScale);
            stage.removeChild(this.textScale);
        }

        public paint(stage: createjs.Stage) {
            //目盛本体
            var g: createjs.Graphics = new createjs.Graphics();
            //ToDo:色の変更
            g.beginStroke("#dfdfdf")
                .moveTo(this.xmin, this.y)
                .lineTo(this.xmax, this.y)
                .closePath();
            this.axisScale = new createjs.Shape(g);
            stage.addChild(this.axisScale);
            //文字
            var str = this.num.toString();
            var t = new createjs.Text(str, "12px Arial", "#000000");
            t.x = this.xmax + 3;
            t.y = this.y;
            stage.addChild(t);
            this.textScale = t;
        }
    }
}   