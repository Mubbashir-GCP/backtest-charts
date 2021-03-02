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

            if(data[0].hasOwnProperty('missed_opportunities')) {
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
                        prediction: bar.actual_labels,
                        match_or_no_match: bar.match_or_no_match,
                        missed_opportunities: bar.missed_opportunities
                    }];
                })

                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

            else {
                // For backtest data

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
                            direction: bar.direction,
                            pnl: bar.pnl,
                            price_in: bar.price_in,
                            price_out: bar.price_out,
                            nbars: bar.nbars,
                            prediction: bar.prediction,
                            act_pred: bar.act_pred,
                            date_in: bar.date_in,
                            date_out: bar.date_out
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
                            prediction: bar.actual_labels,
                        }];
                    });
        
                    console.log(`[getBars]: returned ${bars.length} bar(s)`);
                    onHistoryCallback(backtests_data, { noData: false });
                }
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

        if(backtests_data[0].hasOwnProperty('missed_opportunities')) {
            backtests_data.forEach(bar => {
                let predictionMarkObject;

                if(bar.prediction == null || bar.prediction == 0.0000123) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.prediction) == 0) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(bar.prediction) == 1) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#000', background: '#fff' },
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.prediction) == 2) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        color: { border: '#0000a0', background: '#0000a0' },
                        minSize: 2
                    }
                }

                marks = [...marks, predictionMarkObject]
            })
            i = 0;
            onDataCallback(marks);
            backtests_data = [];
            console.log(marks);
        }

        else {
            if(!backtests_data[0].hasOwnProperty('match_or_no_match')) {
                backtests_data.forEach(bar => {
                    let predictionMarkObject;
    
                    if(bar.act_pred == null || bar.act_pred == 0.0000123) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#c7c7c7', background: '#c7c7c7' },
                            text: `<p>Prediction: ${bar.prediction}</p>
                                   <p>Actual: ${bar.act_pred}</p>
                                   <p>Open: ${bar.open}</p>
                                   <p>High: ${bar.high}</p>
                                   <p>Low: ${bar.low}</p>
                                   <p>Close: ${bar.close}</p>`,
                            minSize: 2
                        }
                    }
    
                    else if(getPredictionInIntegerFormat(bar.act_pred) == 0) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#966330', background: '#966330' },
                            text: `<p>Prediction: ${bar.prediction}</p>
                                   <p>Actual: ${bar.act_pred}</p>
                                   <p>Open: ${bar.open}</p>
                                   <p>High: ${bar.high}</p>
                                   <p>Low: ${bar.low}</p>
                                   <p>Close: ${bar.close}</p>`,
                            minSize: 2
                        }
                    }
                    
                    else if(getPredictionInIntegerFormat(bar.act_pred) == 1) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#e2af80', background: '#e2af80' },
                            text: `<p>Prediction: ${bar.prediction}</p>
                                   <p>Actual: ${bar.act_pred}</p>
                                   <p>Open: ${bar.open}</p>
                                   <p>High: ${bar.high}</p>
                                   <p>Low: ${bar.low}</p>
                                   <p>Close: ${bar.close}</p>`,
                            minSize: 2
                        }
                    }
    
                    else if(getPredictionInIntegerFormat(bar.act_pred) == 2) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            text: `<p>Prediction: ${bar.prediction}</p>
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
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            text: `<p>Prediction: ${bar.prediction}</p>
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
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            text: `<p>Prediction: ${bar.prediction}</p>
                                   <p>Actual: ${bar.act_pred}</p>
                                   <p>Open: ${bar.open}</p>
                                   <p>High: ${bar.high}</p>
                                   <p>Low: ${bar.low}</p>
                                   <p>Close: ${bar.close}</p>`,
                            color: { border: '#000', background: '#fff' },
                            minSize: 2
                        }
                    }
    
                    marks = [...marks, predictionMarkObject]
                });

                i = 0;
                onDataCallback(marks);
                backtests_data = [];
                console.log(marks);
            }
            else {
                backtests_data.forEach(bar => {
                    let predictionMarkObject;

                    if(bar.prediction == null || bar.prediction == 0.0000123) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#c7c7c7', background: '#c7c7c7' },
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }

                    else if(getPredictionInIntegerFormat(bar.prediction) == 0) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#966330', background: '#966330' },
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }
                    
                    else if(getPredictionInIntegerFormat(bar.prediction) == 1) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#e2af80', background: '#e2af80' },
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }

                    else if(getPredictionInIntegerFormat(bar.prediction) == 2) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            color: { border: '#00ccff', background: '#00ccff' },
                            minSize: 2
                        }
                    }

                    else if(getPredictionInIntegerFormat(bar.prediction) == 3) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#0000a0', background: '#0000a0' },
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }
                    
                    else {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color:  { border: '#000', background: '#fff' } ,
                            text: `<p>Actual Label: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }

                    marks = [...marks, predictionMarkObject]
                });

                i = 0;
                onDataCallback(marks);
                backtests_data = [];
                console.log(marks);
            }
        }
    }
}