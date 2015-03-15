module SHChart {
    /**
    マウスに連動した情報描画担当クラス
    */
    export class MouseInfo {
        private dashX: createjs.Shape;
        private dashY: createjs.Shape;
        private DASH_LEN: number = 5;

        constructor(public stage: createjs.Stage, private xmin: number, private xmax: number, private ymin: number, private ymax: number) {
        }

        public paint(ge: GraphElement) {
            //破線を引く
            if (ge.needDash()) {
                if (this.dashX) {
                    this.stage.removeChild(this.dashX);
                    this.dashX = null;
                }
                if (this.dashY) {
                    this.stage.removeChild(this.dashY);
                    this.dashY = null;
                }
                this.createDashX(ge.getX());
                this.createDashY(ge.getY());
            }
        }

        public createDashX(x: number) {
            var g: createjs.Graphics = new createjs.Graphics();
            //ToDo:色の変更
            g.setStrokeStyle(1).beginStroke("#000000");
            //破線の数(*2)を計算
            var dashes: number = (this.ymax - this.ymin) / this.DASH_LEN;
            //半分ずつ線を引く
            for (var y: number = this.ymin, q: number = 0; q < dashes; y += this.DASH_LEN, q++) {
                if (q % 2 == 0) g.moveTo(x, y);
                else g.lineTo(x, y);
            }
            this.dashX = new createjs.Shape(g);
            this.stage.addChild(this.dashX);
        }

        public createDashY(y: number) {
            var g: createjs.Graphics = new createjs.Graphics();
            //ToDo:色の変更
            g.setStrokeStyle(1).beginStroke("#000000");
            //破線の数(*2)を計算
            var dashes: number = (this.xmax - this.xmin) / this.DASH_LEN;
            //半分ずつ線を引く
            for (var x: number = this.xmin, q: number = 0; q < dashes; x += this.DASH_LEN, q++) {
                if (q % 2 == 0) g.moveTo(x, y);
                else g.lineTo(x, y);
            }
            this.dashY = new createjs.Shape(g);
            this.stage.addChild(this.dashY);
        }

        public drop() {
            if (this.dashX) {
                this.stage.removeChild(this.dashX);
                this.dashX = null;
            }
            if (this.dashY) {
                this.stage.removeChild(this.dashY);
                this.dashY = null;
            }
        }


    }
}