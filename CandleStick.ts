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

        private allElements: Array<CandleStick> = [];
        public dateNum: number;

        constructor(private parent: Graph, public date: Date, public open: number, public high: number, public low: number, public close: number) {
            this.dateNum = date.getTime();
            this.isYang = open < close;
            this.allElements.push(this);
        }

        public getMax(): number {
            var max = 0;
            for (var i in this.allElements) {
                var val = this.allElements[i].high;
                if (i == 0 || max < val) max = val;
            }
            return max;
        }

        public getMin(): number {
            var min = 0;
            for (var i in this.allElements) {
                var val = this.allElements[i].low;
                if (i == 0 || min > val) min = val;
            }
            return min;
        }
        
        public getVal(): number {
            return this.allElements[this.allElements.length - 1].close;
        }

        public getOpen(): number {
            return this.allElements[0].open;
        }

        public getClose(): number {
            return this.getVal();
        }

        public getX(): number {
            return this.paintX;
        }

        public getY(): number {
            return this.paintY;
        }
        
        public getAllElements(): Array<GraphElement> {
            return this.allElements;
        }

        public initElements() {
            this.allElements = [];
            this.allElements.push(this);
        }

        public addElement(element: GraphElement) {
            var candle = <CandleStick>element;
            this.allElements.push(candle);
        }

        public paint(stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number): void  {
            //座標決定
            //ToDo:0.8でいいのか？
            var bodyWidth = width * 0.8;
            var bodyXmin = x - bodyWidth / 2;
            var bodyXmax = x + bodyWidth / 2;
            var bodyYmin = ymin + (ymax - ymin) * ((max - (this.isYang ? this.getClose() : this.getOpen())) / (max - min));
            var bodyYmax = ymin + (ymax - ymin) * ((max - (this.isYang ? this.getOpen() : this.getClose())) / (max - min));
            var uShadowYmin = ymin + (ymax - ymin) * ((max - this.getMax()) / (max - min));
            var lShadowYmax = ymin + (ymax - ymin) * ((max - this.getMin()) / (max - min));
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

        private DateStr(date: Date): string {
            var w = ["日", "月", "火", "水", "木", "金", "土"];
            var str: string = date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getDate() + "(" + w[date.getDay()] + ")";
            return str;
        }

        public infoStr(): string {
            var retStr: string;

            retStr = "始値: " + this.getOpen().toString();
            if (this.allElements.length > 1) {
                retStr += " [" + this.DateStr(this.allElements[0].date) + "]";
            }
            var max = this.getMax();
            retStr += "\n高値: " + max.toString();
            if (this.allElements.length > 1) {
                for (var i in this.allElements) {
                    if (this.allElements[i].high == max) {
                        retStr += " [" + this.DateStr(this.allElements[i].date) + "]";
                    }
                }
            }
            var min = this.getMin();
            retStr += "\n安値: " + min.toString();
            if (this.allElements.length > 1) {
                for (var i in this.allElements) {
                    if (this.allElements[i].low == min) {
                        retStr += " [" + this.DateStr(this.allElements[i].date) + "]";
                    }
                }
            }
            retStr += "\n終値: " + this.getClose().toString();
            if (this.allElements.length > 1) {
                retStr += " [" + this.DateStr(this.allElements[this.allElements.length-1].date) + "]";
            }
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