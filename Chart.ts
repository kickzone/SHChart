module SHChart {
    /**
    チャート全体
    グラフの集合体
    */
    export class Chart {
        
        private graphs: Array<Graph> = [];
        private xaxis: XAxis;
        private yaxis: YAxis;
        private stage: createjs.Stage;
        private XAXIS_GAP: number = 100;
        private YAXIS_GAP: number = 100;
        private mi: MouseInfo;
        private canvas: HTMLCanvasElement;
        private info: HTMLDivElement;
        private xrange: XRange;
        public allDates: Array<Date> = [];
        public allDatesNum: Array<number> = [];
        private XRANGE_MIN = 25;
        public htn: HTN = HTN.None;
        private SHU_DAYS = 250;
        private TSUKI_DAYS = 1250;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            //stageを作成
            this.stage = new createjs.Stage(canvas);
            this.xaxis = new XAxis(0, canvas.width - this.YAXIS_GAP, canvas.height - this.XAXIS_GAP);
            //ToDo:100、を他の場所で決定するべき
            this.yaxis = new YAxis(canvas.width - this.YAXIS_GAP, 100, canvas.height - this.XAXIS_GAP);

            //マウスイベント作成
            canvas.addEventListener("mousemove", this.CanvasMouseMove, false);
            canvas.addEventListener("mousedown", this.CanvasMouseDown, false);
            canvas.addEventListener("mouseup", this.CanvasMouseUp, false);
            canvas.addEventListener("mousewheel", this.CanvasMouseWheel, false);
            var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
            $("canvas").on(mousewheelevent, this.CanvasMouseWheel);
            this.mi = new MouseInfo(this.stage, 0, canvas.width - this.YAXIS_GAP, 100, canvas.height - this.XAXIS_GAP);
        }

        /**
        * グラフ追加
        */
        public addGraph(graph: Graph) {
            this.graphs.push(graph);
            if (this.allDates.length == 0) {
                this.UpdateAllDates();
            }
        }

        public setInfo(info: HTMLDivElement) {
            this.info = info;
        }

        private UpdateAllDates() {
            //allDatesをアップデート
            this.allDates = [];
            this.allDatesNum = [];
            var graph: Graph = this.graphs[0];
            for (var i in graph.elements) {
                var element: GraphElement = graph.elements[i];
                this.allDates.push(element.date);
            }
            this.allDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
            for (var i in this.allDates) {
                this.allDatesNum.push(this.allDates[i].getTime());
            }
        }

        public paint(start: Date, end: Date) {

            //描画単位決定
            var htn = this.decideHTN(start, end);
            if (htn != this.htn) {
                for (var i in this.graphs) {
                    var graph: Graph = this.graphs[i];
                    graph.convertScale(htn);
                }
                this.htn = htn;
                this.UpdateAllDates();
            }

            //グループごとのmin, maxを得る
            //全グラフから範囲内の日付の配列も得る
            var min: Array<number> = [];
            var max: Array<number> = [];
            var dates: Array<Date> = [];
            var trueDateNum: number = 0;
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                for (var j in graph.elements) {
                    var element: GraphElement = graph.elements[j];
                    //期間内のものだけ対象にする
                    if (start <= element.date && element.date <= end) {
                        if (min[graph.group] == undefined || min[graph.group] > element.getMin()) min[graph.group] = element.getMin();
                        if (max[graph.group] == undefined || max[graph.group] < element.getMax()) max[graph.group] = element.getMax();
                        if (i == 0) {
                            //var bFindDate: boolean = false;
                            //for (var j in dates) {
                            //    if (element.date.getTime() == dates[j].getTime()) {
                            //        bFindDate = true;
                            //        break;
                            //    }
                            //}
                            //if (!bFindDate) dates.push(element.date);
                            dates.push(element.date);
                            trueDateNum += element.getAllElements().length;
                        }
                    }
                }
            }
            dates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>this.stage.canvas;
            this.xrange = new XRange(dates, 0, canvas.width - this.YAXIS_GAP, trueDateNum);

            //X軸描画
            this.xaxis.paint(this.stage, this.xrange);
            //Y軸描画
            //ToDo:minとmaxの取得方法
            this.yaxis.paint(this.stage, min[1], max[1]);

            //グラフ描画
            for (var i in this.graphs) {
                var graph: Graph = this.graphs[i];
                graph.paint(this.stage, this.xrange, min[graph.group], max[graph.group], this.htn);
            }


            //更新
            this.stage.update();
        }

        /**
        日足、週足、月足のどれを使うか
        */
        private decideHTN(start: Date, end: Date): HTN {
            var datesNum: number = 0;
            for (var i in this.graphs[0].elements) {
                var element: GraphElement = this.graphs[0].elements[i];
                if (start <= element.date && element.date <= end) {
                    datesNum += element.getAllElements().length;
                }
            }
            if (datesNum < this.SHU_DAYS) {
                return HTN.Hiashi;
            } else if (datesNum < this.TSUKI_DAYS) {
                return HTN.Shuashi;
            }
            return HTN.Tsukiashi;
        }

        private allDateIdx(date: Date): number{
            var targetTime = date.getTime();
            for (var i = 0; i < this.allDatesNum.length; i++) {
                if (this.allDatesNum[i] == targetTime) {
                    return i;
                }
            }
            return -1;
        }

        /**
        マウスカーソルに合わせた描画
        */
        CanvasMouseMove = (e: MouseEvent) => {
            //ドラッグイベントの処理
            if (this.dragEvents.onDrag) {
                if (this.dragEvents.currentX != e.pageX) {
                    var deltaX: number = (e.pageX - this.dragEvents.currentX);
                    //xrangeのグラフ1つ分の幅より大きくなったらスクロールする
                    if (Math.abs(deltaX) > this.xrange.xsize) {
                        var delta = Math.floor(deltaX / this.xrange.xsize) * -1;
                        var startIdx = this.allDateIdx(this.xrange.start) + delta;
                        var endIdx = this.allDateIdx(this.xrange.end) + delta;
                        //グラフの端まで来た場合の調整
                        if (startIdx < 0) {
                            endIdx -= startIdx;
                            startIdx = 0;
                        } else if (endIdx >= this.allDates.length) {
                            startIdx -= (endIdx - (this.allDates.length - 1));
                            endIdx = this.allDates.length - 1;
                        }
                        //画面更新
                        if (this.allDatesNum[startIdx] != this.xrange.start.getTime()) {
                            this.paint(this.allDates[startIdx], this.allDates[endIdx]);
                        }
                        this.dragEvents.currentX = e.pageX;
                    }
                }
            }

            //いったん削除
            this.mi.drop();
            //clientXはウインドウ内の座標なので、canvas上の座標に変換
            var xCanvas = e.clientX - this.canvas.offsetLeft;
            for (var i in this.graphs) {
                //描画
                this.graphs[i].paintMouseInfo(xCanvas, this.mi);
            }
            this.stage.update();
            //divタグ用に出力する情報
            if (this.info) {
                this.info.innerHTML = "";
                var str: string = "";
                if (this.htn == HTN.Hiashi) str = "日足 ";
                else if (this.htn == HTN.Shuashi) str = "週足 ";
                else str = "月足 ";
                var date: Date = this.xrange.getDate(xCanvas);
                if (date) {
                    var w = ["日", "月", "火", "水", "木", "金", "土"];
                    str += date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getDate() + "(" + w[date.getDay()] + ")";
                    for (var i in this.graphs) {
                        var graphStr = this.graphs[i].getInfoStr(date);
                        if (graphStr != "") {
                            str += "\n" + graphStr;
                        }
                    }
                    this.info.innerHTML = str;
                }
            }
        }

        //TypeScriptだと次のような書式で勝手に型付けしてくれる。すごい
        /**
        ドラッグ用情報
        */
        private dragEvents = {
            onDrag: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };

        /**
        クリック開始
        */
        CanvasMouseDown = (e: MouseEvent) => {
            if (e.button == 0) {
                this.dragEvents.onDrag = true;
                this.dragEvents.startX = e.pageX;
                this.dragEvents.startY = e.pageY;
                this.dragEvents.currentX = e.pageX;
                this.dragEvents.currentY = e.pageY;
            }
        }

        /**
        クリック終了
        */
        CanvasMouseUp = (e: MouseEvent) => {
            this.dragEvents.onDrag = false;
        }

        /**
        ホイールで拡大・縮小
        */
        CanvasMouseWheel = (e: any) => {
            //暫定：拡大・縮小量は表示中のアイテムの大きさの5%
            var deltaSize = Math.ceil(this.xrange.dates.length * 0.05);
            e.preventDefault();
            var delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
            if (!delta) {
                delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
            }
            if (delta > 0) {
                //拡大
                //右側から一つ減らす
                if (this.xrange.dates.length - deltaSize > this.XRANGE_MIN) {
                    this.paint(this.xrange.dates[deltaSize], this.xrange.end);
                }
            } else {
                //縮小
                //右側に一つ加える、右端だったら左側に一つ加える
                var startIdx = this.allDateIdx(this.xrange.start);
                var newIdx = Math.max(this.allDateIdx(this.xrange.start) - deltaSize, 0);
                if (startIdx != newIdx) {
                    this.paint(this.allDates[newIdx], this.xrange.end);
                } else {
                    var endIdx = this.allDateIdx(this.xrange.end);
                    newIdx = Math.min(endIdx + deltaSize, this.allDates.length - 1);
                    if (endIdx != newIdx) {
                        this.paint(this.xrange.start, this.allDates[newIdx]);
                    }
                }
            }

        return false;
        }
    }

    /**
    日足、週足、月足
    */
    export enum HTN {
        None,
        Hiashi,
        Shuashi,
        Tsukiashi
    }
}