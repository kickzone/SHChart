module SHChart {
    /**
    グラフ作成用のインターフェース 日付、最大・最小値以外の処理は各要素に任せる
    */
    export interface GraphElement {
        date: Date;
        getMax: () => number;
        getMin: () => number;
        /**
        描画
        */
        paint: (stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number) => void;
        /**
        削除
        */
        drop: (stage: createjs.Stage) => void;
    }
}