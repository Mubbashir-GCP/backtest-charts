import { makeApiRequest } from './helpers.js';

let backtests_data = [];

const symbolInfo = {
    name: 'NVDA',
    ticker: 'NVDA',
    type: 'stock',
    supported_resolutions: ['1'],
    session: '0930-1600',
    minmov: 1,
    has_intraday: true,
    data_status: 'endofday',
    pricescale: 100
}

const configurationData = {
    supported_resolutions: [],
    supports_marks: true,
    // supports_timescale_marks: true
}

export default {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (userInput, value="", symbolType="", onResultReadyCallback) => {
        console.log('[searchSymbols]: Metod call');
        onResultReadyCallback(configurationData);
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
    },
    getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        console.log('[getBars]: Method call', symbolInfo);

        let bars = []

        try {
            const data = await makeApiRequest();

            if(!data[0].hasOwnProperty('match_or_no_match')) {
                console.log('Backtest Block called');

                data.forEach(bar => {
                    let timestamp = new Date(bar.timestamp_);
                    let time = Math.floor(timestamp.getTime());
                    
                    backtests_data = [...backtests_data, {
                        time: time, 
                        low: bar.l,
                        high: bar.h,
                        open: bar.o,
                        close: bar.c,
                        volume: bar.v,
                        prediction: bar.prediction,
                        act_pred: bar.act_pred,
                    }];
                });
                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }
            else {
                data.forEach(bar => {
                    let timestamp = new Date(bar.timestamps);
                    let time = Math.floor(timestamp.getTime());

                    backtests_data = [...backtests_data, {
                        time: time, 
                        low: bar.l,
                        high: bar.h,
                        open: bar.o,
                        close: bar.c,
                        volume: bar.v,
                        match_or_no_match: bar.match_or_no_match,
                    }];
                });

                console.log(`[getBars]: returned ${bars.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }
        }
        catch (error) {
            console.log('[getBars]: Get error', error);
            onErrorCallback(error);
        }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {

    },
    
    unsubscribeBars: (subscriberUID) => {

    },
    getMarks: async (symbolInfo, from, to, onDataCallback, resolution) => {
        console.log('[getMarks]: Method call');

        let marks = [];
        console.log(backtests_data);
        let i = 0;

        if(!backtests_data[0].hasOwnProperty('match_or_no_match')) {
            backtests_data.forEach(bar => {
                let translatedMarkObject;

                if(bar.prediction == null || Number(bar.prediction) == 0.0000123) {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(Number(bar.prediction)) == 0) {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(Number(bar.prediction)) == 1) {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#e2af80', background: '#e2af80' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(Number(bar.prediction)) == 2) {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(Number(bar.prediction)) == 3) {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#0000a0', background: '#0000a0' },
                        minSize: 2
                    }
                }
                else {
                    translatedMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#000', background: '#fff' },
                        minSize: 2
                    }
                }

                marks = [...marks, translatedMarkObject]

                let actualPredictionMarkObject;

                if(bar.act_pred == null || bar.act_pred == 0.0000123) {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.act_pred) == 0) {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(bar.act_pred) == 1) {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#e2af80', background: '#e2af80' },
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.act_pred) == 2) {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.act_pred) == 3) {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#0000a0', background: '#0000a0' },
                        minSize: 2
                    }
                }
                else {
                    actualPredictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Translated: ${bar.prediction}</p>
                               <p>Actual: ${bar.act_pred}</p>
                               <p>Open: ${bar.open}</p>
                               <p>High: ${bar.high}</p>
                               <p>Low: ${bar.low}</p>
                               <p>Close: ${bar.close}</p>`,
                        color: { border: '#000', background: '#fff' },
                        minSize: 2
                    }
                }

                marks = [...marks, actualPredictionMarkObject]
            });

            i = 0;
            onDataCallback(marks);
            backtests_data = [];
            console.log(marks);
        }
        else {
            backtests_data.forEach(bar => {
                let markObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: bar.match_or_no_match == 'No Match!' ? { border: '#d63c2d', background: '#d63c2d' } : 
                                                                { border: '#32cd32', background: '#32cd32' },
                    text: `<p>${bar.match_or_no_match}</p>`,
                    minSize: 2
                }
                
                marks = [...marks, markObject];
            });

            i = 0;
            onDataCallback(marks);
            backtests_data = [];
            console.log(marks);
        }
    }
}