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

                console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

            else if(!data[0].hasOwnProperty('match_or_no_match')) {
                data.forEach(bar => {
                    let timestamp = new Date(bar.timestamp_);
                    let time = Math.floor(timestamp.getTime());
                    
                    backtests_data = [...backtests_data, {
                        time: time, 
                        low: bar.cum_pnl,
                        high: bar.cum_pnl,
                        open: bar.cum_pnl,
                        close: bar.cum_pnl,
                        direction: bar.direction,
                        pnl: bar.pnl,
                        price_in: bar.price_in,
                        price_out: bar.price_out,
                        nbars: bar.nbars,
                        prediction: bar.prediction
                    }];
                });
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
                        actual_labels: bar.actual_labels,
                        predicted_labels: bar.predicted_labels,
                        match_or_no_match: bar.match_or_no_match
                    }];
                });
            }

            console.log(`[getBars]: returned ${backtests_data.length} bar(s)`);
            onHistoryCallback(backtests_data, { noData: false });
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

        if(backtests_data[0].hasOwnProperty('missed_opportunities')) {
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
                        color: bar.prediction == 0 ? { border: '#b00000', background: '#b00000' } : 
                                                    { border: '#007818', background: '#007818' },
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
                        color: bar.pnl >= 0 ? 'green' : 'red',
                        text:  hoverBoxText,
                        label: bar.direction == 'long' ? 'L' : 'S',
                        labelFontColor: '#ffffff',
                        minSize: markSize 
                    }
    
                    marks = [...marks, markObject];
                }
            });
        }

        else {
            backtests_data.forEach(bar => {
                let predictedLabelMarkObject;
                
                if(bar.predicted_labels == null || bar.predicted_labels == 0.0000123) {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.predicted_labels) == 0) {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(bar.predicted_labels) == 1) {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#e2af80', background: '#e2af80' },
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.predicted_labels) == 2) {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        color: { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.predicted_labels) == 3) {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#0000a0', background: '#0000a0' },
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        minSize: 2
                    }
                }
                
                else {
                    predictedLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color:  { border: '#000', background: '#fff' } ,
                        text: `<p>Predicted Label: ${bar.predicted_labels}</p>`,
                        minSize: 2
                    }
                }

                marks = [...marks, predictedLabelMarkObject];

                let actualLabelMarkObject;

                if(bar.actual_labels == null || bar.actual_labels == 0.0000123) {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.actual_labels) == 0) {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#966330', background: '#966330' },
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        minSize: 2
                    }
                }
                
                else if(getPredictionInIntegerFormat(bar.actual_labels) == 1) {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#e2af80', background: '#e2af80' },
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.actual_labels) == 2) {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        color: { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                else if(getPredictionInIntegerFormat(bar.actual_labels) == 3) {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#0000a0', background: '#0000a0' },
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        minSize: 2
                    }
                }
                
                else {
                    actualLabelMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color:  { border: '#000', background: '#fff' } ,
                        text: `<p>Actual Label: ${bar.actual_labels}</p>`,
                        minSize: 2
                    }
                }

                marks = [...marks, actualLabelMarkObject]
            });
        }
        
        i = 0;
        onDataCallback(marks);
        backtests_data = [];
        console.log(marks);
    },
}