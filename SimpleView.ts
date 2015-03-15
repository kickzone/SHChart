/// <reference path="scripts/typings/jquery/jquery.d.ts" />
module SHChart {
    export class SimpleView {
        public static View(canvas: HTMLCanvasElement, info: HTMLDivElement, title: HTMLHeadElement, option: SimpleViewOption) {
            canvas.width = 800;
            canvas.height = 600;
            var chart: SHChart.Chart = new SHChart.Chart(canvas);
            chart.setInfo(info);

            //銘柄情報、日足をゲット
            var meigara: Meigara;
            //$.ajax({
             //   async: false,
            //    type: "POST",
            //    url: "ajax_getmeigara.php",
            //    data: { mcode: option.mcode }
            //}).done(function (msg) {
            //    meigara = eval("(" + msg + ")");
            //});
            meigara = odakyuStock;

            title.innerHTML = meigara.mname;

            var sma25DV = SHChart.Stats.CalcSMA(meigara.hiashi, 25);
            var sma75DV = SHChart.Stats.CalcSMA(meigara.hiashi, 75);

            var gHiashi: SHChart.Graph;
            //日足 or 終値
            if (option.mainGraphType == 0) gHiashi = new SHChart.Graph("日足", 1, 100, 500, true);
            else gHiashi = new SHChart.Graph("終値", 1, 100, 500, true);
            var gSma25: SHChart.Graph = new SHChart.Graph("25日移動平均", 1, 100, 500, false);
            var gSma75: SHChart.Graph = new SHChart.Graph("75日移動平均", 1, 100, 500, false);

            var sma25Prev: SHChart.LineChart;
            var sma75Prev: SHChart.LineChart;

            if (option.mainGraphType == 0) SHChart.CandleStick.InputGraphByHiashi(meigara.hiashi, gHiashi);
            else SHChart.LineChart.InputGraphByHiashi(meigara.hiashi, "#000000", gHiashi);

            SHChart.LineChart.InputGraphByDateVal(sma25DV, "#228b22", gSma25);
            SHChart.LineChart.InputGraphByDateVal(sma75DV, "#4169e1", gSma75);

            chart.addGraph(gHiashi);
            chart.addGraph(gSma25);
            chart.addGraph(gSma75);


            //日付の指定がない場合は、100日間を表示
            if (!option.start) {
                option.end = chart.allDates[chart.allDates.length - 1];
                option.start = chart.allDates[Math.max(chart.allDates.length - 101, 0)];
            }

            chart.paint(option.start, option.end);
        }
    }

    export class SimpleViewOption {
        public mcode: number;
        public mainGraphType = 0;
        public useSMA25 = true;
        public useSMA75 = true;
        public start: Date;
        public end: Date;
    }
}