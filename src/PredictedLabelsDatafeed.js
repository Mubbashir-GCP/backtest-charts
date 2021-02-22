import { makeApiRequest } from './helpers.js';

const getPredictionInIntegerFormat = (predictedLabel) => {
    if(predictedLabel >= 0.0 && predictedLabel < 0.5)
        return 0;
    else if(predictedLabel >= 0.5 && predictedLabel < 1.5)
        return 1;
    else if(predictedLabel >= 1.5 && predictedLabel < 2.5)
        return 2;
    else 
        return 3;
}

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
                    prediction: bar.predicted_labels,
                }];
            });

            console.log(`[getBars]: returned ${bars.length} bar(s)`);
            onHistoryCallback(backtests_data, { noData: false });
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

        backtests_data.forEach(bar => {
            let predictionMarkObject;

            if(bar.prediction == null) {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: { border: '#c7c7c7', background: '#c7c7c7' },
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    minSize: 2
                }
            }

            else if(getPredictionInIntegerFormat(bar.prediction) == 0) {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: { border: '#654321', background: '#654321' },
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    minSize: 2
                }
            }
            
            else if(getPredictionInIntegerFormat(bar.prediction) == 1) {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: { border: '#e2af80', background: '#e2af80' },
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    minSize: 2
                }
            }

            else if(getPredictionInIntegerFormat(bar.prediction) == 2) {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    color: { border: '#00ccff', background: '#00ccff' },
                    minSize: 2
                }
            }

            else if(getPredictionInIntegerFormat(bar.prediction) == 3) {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: { border: '#0000a0', background: '#0000a0' },
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    minSize: 2
                }
            }
            
            else {
                predictionMarkObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color:  { border: '#000', background: '#fff' } ,
                    text: `<p>Prediction: ${bar.prediction}</p>`,
                    minSize: 2
                }
            }

            marks = [...marks, predictionMarkObject]
        });

        i = 0;
        onDataCallback(marks);
        console.log(marks);
    }
}