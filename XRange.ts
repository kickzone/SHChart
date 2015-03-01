module SHChart {
    /**
    X軸の日付の範囲、描画位置を表す
    複数のグラフで共通に使用する
    */
    export class XRange {
        public start: Date;
        public end: Date;
        private xpos: Array<number> = [];
        public xsize: number;

        constructor(public dates: Array<Date>, public xmin: number, public xmax: number) {
            //開始日、終了日
            this.start = dates[0];
            this.end = dates[dates.length - 1];

            //xmin, xmaxと要素の数から幅を決定
            this.xsize = (xmax - xmin) / this.dates.length;

            for (var i in this.dates) {
                this.xpos.push(this.xsize * i + this.xsize / 2);
            }
        }

        public GetX(date: Date): number {
            for (var i in this.dates) {
                if (this.dates[i].getTime() == date.getTime()) {
                    return this.xpos[i];
                }
            }
            return 0;
        }
    }
} 