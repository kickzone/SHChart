/// <reference path="scripts/typings/easeljs/easeljs.d.ts" />
module SHChart {
    export class CandleStick implements GraphElement {

        //ローソク本体
        private body: createjs.Shape;
        //上ヒゲ
        private uShadow: createjs.Shape;
        //下ヒゲ
        private lShadow: createjs.Shape;

        //陽線か？
        private isYang: boolean;

        private paintX: number;
        private paintY: number;

        constructor(private parent: Graph, public date: Date, public open: number, public high: number, public low: number, public close: number) {
            this.isYang = open < close;
        }

        public getMax(): number {
            return this.high;
        }

        public getMin(): number {
            return this.low;
        }
        
        public getVal(): number {
            return this.close;
        }

        public getX(): number {
            return this.paintX;
        }

        public getY(): number {
            return this.paintY;
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void  {
            //座標決定
            //ToDo:0.8でいいのか？
            var bodyWidth = width * 0.8;
            var bodyXmin = x - bodyWidth / 2;
            var bodyXmax = x + bodyWidth / 2;
            var bodyYmin = ymin + (ymax - ymin) * ((max - (this.isYang ? this.close : this.open)) / (max - min));
            var bodyYmax = ymin + (ymax - ymin) * ((max - (this.isYang ? this.open : this.close)) / (max - min));
            var uShadowYmin = ymin + (ymax - ymin) * ((max - this.high) / (max - min));
            var lShadowYmax = ymin + (ymax - ymin) * ((max - this.low) / (max - min));
            //本体描画
            var g: createjs.Graphics = new createjs.Graphics();
            //ToDo:色の変更
            g.beginStroke("#000000");
            if (!this.isYang) g.beginFill("#000000");
            if (bodyYmin == bodyYmax) {
                //始値==終値の場合
                g.moveTo(bodyXmin, bodyYmin)
                    .lineTo(bodyXmax, bodyYmin)
                    .closePath();
            } else {
                g.drawRect(bodyXmin, bodyYmin, bodyXmax - bodyXmin, bodyYmax - bodyYmin);
            }
            this.body = new createjs.Shape(g);
            stage.addChild(this.body);

            //マウスイベント用の座標保存
            this.paintX = x;
            this.paintY = (this.isYang ? bodyYmin : bodyYmax); 

            //ヒゲの描画
            if (uShadowYmin < bodyYmin) {
                g = new createjs.Graphics();
                //ToDo:色の変更
                g.beginStroke("#000000")
                    .moveTo(x, bodyYmin)
                    .lineTo(x, uShadowYmin)
                    .closePath();
                this.uShadow = new createjs.Shape(g);
                stage.addChild(this.uShadow);
            }
            if (lShadowYmax > bodyYmax) {
                g = new createjs.Graphics();
                //ToDo:色の変更
                g.beginStroke("#000000")
                    .moveTo(x, bodyYmax)
                    .lineTo(x, lShadowYmax)
                    .closePath();
                this.lShadow = new createjs.Shape(g);
                stage.addChild(this.lShadow);
            }
        }

        public drop(stage: createjs.Stage) {
            if(this.body) stage.removeChild(this.body);
            if(this.uShadow) stage.removeChild(this.uShadow);
            if(this.lShadow) stage.removeChild(this.lShadow);
        }

        public needDash(): boolean {
            return this.parent.needDash;
        }

        public infoStr(): string {
            var retStr: string;
            retStr = "始値: " + this.open.toString() + "\n高値: " + this.high.toString() + "\n安値: " + this.low.toString() + "\n終値: " + this.close.toString();
            return retStr;
        }

        public getParent(): Graph {
            return this.parent;
        }

        public static InputGraphByHiashi(aHiashi: Array<Hiashi>, graph: Graph): void {
            for (var i in aHiashi) {
                var h: SHChart.Hiashi = aHiashi[i];
                var ge: SHChart.GraphElement = new SHChart.CandleStick(graph, new Date(h.ymd), Number(h.open), Number(h.high), Number(h.low), Number(h.close));

                graph.addData(ge);
            }
        }
    }
}