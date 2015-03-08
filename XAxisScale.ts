module SHChart {
    /**
    X軸の目盛1つ分
    */
    export class XAxisScale {
        /**
        目盛本体
        */
        private axisScale: createjs.Shape;
        /**
        文字(日付)
        */
        private textScale: createjs.Text;

        constructor(public x: number, public ymin, public ymax: number, public date: Date) {
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
                .moveTo(this.x, this.ymin)
                .lineTo(this.x, this.ymax)
                .closePath();
            this.axisScale = new createjs.Shape(g);
            stage.addChild(this.axisScale);
            //文字
            var str = this.date.getFullYear().toString() + "/" + (this.date.getMonth()+1).toString() + "/" + this.date.getDate();
            var t = new createjs.Text(str, "12px Arial", "#000000");
            t.x = this.x + 5;
            t.y = this.ymax + 10;
            stage.addChild(t);
            this.textScale = t;
        }
    }
}  