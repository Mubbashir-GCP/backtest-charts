import { makeApiRequest } from './helpers.js';

let backtests_data = [];

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
    supports_timescale_marks: true
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

        try {
            const data = await makeApiRequest();
            
            if(data.hasOwnProperty('noData'))
                alert('No Data returned!');

            // This is for ALM Plots since the data doesn't have 'high' values
            if(!data[0].hasOwnProperty('h')) {

                // This is for ALM PCT because ALM PCT data has 'Open' values but ALM PKTR doesn't
                if(data[0].hasOwnProperty('o')) {
                    data.forEach(bar => {
                        let timestamp = new Date(bar.timestamps);
                        let time = Math.floor(timestamp.getTime());
    
                        backtests_data = [...backtests_data, {
                            time: time, 
                            low: bar.c,
                            high: bar.c,
                            open: bar.c,
                            close: bar.c,
                            volume: bar.v,
                            prediction: bar.actual_labels,
                            almModel: true,
                            almPct: true
                        }];
                    });
    
                    console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                    onHistoryCallback(backtests_data, { noData: false });
                }

                // This is for ALM PKTR
                else {
                    data.forEach(bar => {
                        let timestamp = new Date(bar.timestamps);
                        let time = Math.floor(timestamp.getTime());
    
                        backtests_data = [...backtests_data, {
                            time: time, 
                            low: bar.c,
                            high: bar.c,
                            open: bar.c,
                            close: bar.c,
                            volume: bar.v,
                            prediction: bar.actual_labels,
                            almModel: true,
                            almPktr: true
                        }];
                    });
    
                    console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                    onHistoryCallback(backtests_data, { noData: false });
                }
            }

            // This is for PCT Plot
            else if(data[0].hasOwnProperty('missed_opportunities')) {
                console.log('PCT Model Block called');

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
                        match_or_no_match: bar.match_or_no_match,
                        missed_opportunities: bar.missed_opportunities
                    }];
                });

                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

            else if(!data[0].hasOwnProperty('match_or_no_match')) {
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
                        prediction: bar.prediction
                    }];
                });
                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

            else {
                console.log('Model Block called');

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
                        match_or_no_match: bar.match_or_no_match
                    }];
                });

                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

        } catch (error) {
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

        if(backtests_data[0].hasOwnProperty('almModel')) {
            if(backtests_data[0].hasOwnProperty('almPct')) {
                backtests_data.forEach(bar => {
                    let predictionMarkObject;
    
                    if(bar.prediction == null || bar.prediction == 0.0000123) {
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
                            color: { border: '#966330', background: '#966330' },
                            text: `<p>Prediction: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }
                    
                    else if(getPredictionInIntegerFormat(bar.prediction) == 1) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            color: { border: '#000', background: '#fff' },
                            text: `<p>Prediction: ${bar.prediction}</p>`,
                            minSize: 2
                        }
                    }
    
                    else if(getPredictionInIntegerFormat(bar.prediction) == 2) {
                        predictionMarkObject = {
                            id: i++,
                            time: bar.time / 1000,
                            text: `<p>Prediction: ${bar.prediction}</p>`,
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
                backtests_data.forEach(bar => {
                    let predictionMarkObject;
    
                    if(bar.prediction == null || bar.prediction == 0.0000123) {
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
                            color: { border: '#966330', background: '#966330' },
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
                })
                i = 0;
                onDataCallback(marks);
                backtests_data = [];
                console.log(marks);
            }
        }

        else if(backtests_data[0].hasOwnProperty('missed_opportunities')) {
            backtests_data.forEach(bar => {
                let predictionMarkObject;

                if(bar.prediction == null || bar.prediction == 0.0000123) {
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
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Prediction: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(bar.prediction) == 1) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#000', background: '#fff' },
                        text: `<p>Prediction: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.prediction) == 2) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Prediction: ${bar.prediction}</p>`,
                        color: { border: '#0000a0', background: '#0000a0' },
                        minSize: 2
                    }
                }

                marks = [...marks, predictionMarkObject]

                let markObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: bar.match_or_no_match == 'No Match!' ? { border: '#d63c2d', background: '#d63c2d' } : 
                                                                  { border: '#32cd32', background: '#32cd32' },
                    text: `<p>${bar.match_or_no_match}</p>`,
                    minSize: 2
                }

                marks = [...marks, markObject];
            })
            i = 0;
            onDataCallback(marks);
            backtests_data = [];
            console.log(marks);
        }

        else if(!backtests_data[0].hasOwnProperty('match_or_no_match')) {
            backtests_data.forEach(bar => {
                let predictionMarkObject;

                
                if(bar.prediction == null) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        minSize: 2
                    }
                }
                
                else if(bar.prediction == 1) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#000', background: '#fff' },
                        minSize: 2
                    }
                }
                
                else {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: bar.prediction == 0 ? { border: '#b5651d', background: '#b5651d' } : 
                                                    { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                marks = [...marks, predictionMarkObject]

                if(bar.direction != null) {
                    let markSize;

                    if(bar.pnl >= 0) {
                        if(bar.pnl <= 5)
                            markSize = 20;
                        else if(bar.pnl <= 10)
                            markSize = 24;
                        else if(bar.pnl <= 15)
                            markSize = 28;
                        else if(bar.pnl <= 20)
                            markSize = 32;
                        else if(bar.pnl <= 25)
                            markSize = 36;
                        else if(bar.pnl <= 30)
                            markSize = 40;
                        else
                            markSize = 44;
                    }
                    else {
                        if(bar.pnl >= -5)
                            markSize = 20;
                        else if(bar.pnl >= -10)
                            markSize = 24;
                        else if(bar.pnl >= -15)
                            markSize = 28;
                        else if(bar.pnl >= -20)
                            markSize = 32;
                        else if(bar.pnl >= -25)
                            markSize = 36;
                        else if(bar.pnl >= -30)
                            markSize = 40;
                        else
                            markSize = 44;
                    }

                    let hoverBoxText = `<p>PNL: ${bar.pnl}</p>` +
                                        `<p>Price In: ${bar.price_in.toString()}</p>` +
                                        `<p>Price Out: ${bar.price_out.toString()}</p>` +
                                        `<p>nbars: ${bar.nbars}</p>`;

                    let markObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: bar.pnl >= 0 ? { border: '#32cd32', background: '#32cd32' } : 
                                              { border: '#d63c2d', background: '#d63c2d' },
                        text:  hoverBoxText,
                        label: bar.direction == 'long' ? 'L' : 'S',
                        labelFontColor: '#ffffff',
                        minSize: markSize 
                    }

                    marks = [...marks, markObject];
                    
                    // ++i;
                    // console.log(marks);
                }
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
                        text: `<p>Prediction: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.prediction) == 0) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
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

                let markObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: bar.match_or_no_match == 'No Match!' ? { border: '#d63c2d', background: '#d63c2d' } : 
                                                                  { border: '#32cd32', background: '#32cd32' },
                    text: `<p>${bar.match_or_no_match}</p>`,
                    minSize: 2
                }

                marks = [...marks, markObject];
            })
            i = 0;
            onDataCallback(marks);
            backtests_data = [];
            console.log(marks);
        }
    },
}