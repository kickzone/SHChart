module SHChart {
    /**
    統計用の静的関数ライブラリ
    */
    export class Stats {

        /**
        n日移動平均を求める
        */
        public static CalcSMA(hiashiArr: Array<Hiashi>, days: number): Array<DateVal> {
            var retArr: Array<DateVal> = [];

            var currentSum: number = 0;
            for (var i in hiashiArr) {
                var hiashi: Hiashi = hiashiArr[i];
                var dv: DateVal = new DateVal;
                dv.date = new Date(hiashi.ymd);
                currentSum += Number(hiashi.close);
                if (i >= days) {
                    var nPrevHiashi = hiashiArr[i - days];
                    currentSum -= Number(nPrevHiashi.close);
                    dv.val = currentSum / days;
                } else {
                    dv.val = currentSum / (i + 1);
                }
                retArr[i] = dv;
            }
            return retArr;
        }
    }
} 