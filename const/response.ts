// type Language = 'ru' | 'en'

type Symbols = '1' | '2' |'I' | 'F' | 'A' | 'B' | 'C' | 'D' | 'G' | 'H' | 'J' | 'E'
type Type = "regular" | "big" | "ultra" | "mega"

interface ILine {
    id: string,
    amount: number,
    positions: [[number, number]],
    symbol: Symbols
}

interface IWin {
        total: number;
        type: Type;
        lines: Array<ILine>,
}

interface IEW {
    type: "expending_wild",
    winAmount: number,
    positions: [[number,number]],
    symbol: Symbols
}

interface IMultiplier {
    multiplier: {
        value: 2,
        win: number
    }
}

interface IRespin {
    respin: {
        total: number
    }
}

interface IExpendingWin {
    matrix: Array<Array<string>>,
    win: IWin
}

interface IBaseResponse {
    user: {
    currency: string,
    balance: number
    i18n: string
    }
    context: {
        current: string;
        actions: Array<string>;
        matrix: Array<Array<string>>;
        bet: number;
        lines: number;
        win?:IWin,
        expendingWin?: IExpendingWin,
        feature?: {
            multiplier?: IMultiplier,
            expendingWild?: IEW,

        }
        freespins?: {
            count: {
                add: number,
                rest: number,
                total: number,
            }
            expendingSymbol?: Symbols,
            win: number;
        }
        respin?: IRespin;
    };
    status: {
        ok: boolean;
        code: number;
        message: string;
    }
}

interface IInit extends IBaseResponse {
    user: {
        currency: string,
        balance: number
        i18n: string
        playerId: string,
        userName: string,
        oid: number,
        cid: string,
        settings: {
            turbo: boolean,
            sound: boolean,
        }
    },
    settings: {
        width: number,
        height: number,
        rtp: number,
        type: Type;
        bets: Array<number>,
        autoplay: {
            count: Array<number>,
            limits: {
                loss: Array<number>,
                win: Array<number>,
            }
        }
        reels: Array<Array<Symbols>>;
        lines: {
            [key: number]: [number, number]
        };
        paytable: {
            [key in Symbols]: {
                [key in Symbols]: number
            }
        };
    };
}


