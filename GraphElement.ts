module SHChart {
    /**
    グラフ作成用のインターフェース 日付、最大・最小値以外の処理は各要素に任せる
    */
    export interface GraphElement {
        date: Date;
        dateNum: number;
        /**
        最大値
        */
        getMax: () => number;
        /**
        最小値
        */
        getMin: () => number;
        /**
        代表値
        */
        getVal: () => number;
        /**
        canvas上の座標 マウス情報で使用
        */
        getX: () => number;
        /**
        canvas上の座標 マウス情報で使用
        */
        getY: () => number;
        /**
        描画
        */
        paint: (stage: createjs.Stage, min: number, max: number, x: number, width: number, xmin: number, xmax: number, ymin: number, ymax: number) => void;
        /**
        削除
        */
        drop: (stage: createjs.Stage) => void;

        /**
        破線を引くかどうか
        */
        needDash: () => boolean;

        /*
        DOMに出力する文字列をゲット
        */
        infoStr: () => string;

        /**
        親のグラフを得る
        */
        getParent: () => Graph;

        /**
        日足、週足、月足変換用 全Elementを得る
        */
        getAllElements: () => Array<GraphElement>;

        /**
        日足、週足、月足変換用 aggrregateするElementを追加
        */
        addElement: (element: GraphElement) => void;

        /**
        日足、週足、月足変換用 初期化
        */
        initElements: () => void;
    }
}