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
                data.forEach(bar => {
                    let timestamp = new Date(bar.Timestamp);
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
                });

                backtests_data = [...backtests_data, {
                    time: time, 
                    low: bar.l,
                    high: bar.h,
                    open: bar.o,
                    close: bar.c,
                    volume: bar.v,
                    prediction: bar.actual_labels,
                    match_or_no_match: bar.match_or_no_match
                }];
            }

            console.log(`[getBars]: returned ${bars.length} bar(s)`);
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

        if(!backtests_data[0].hasOwnProperty('match_or_no_match')) {
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
                let predictionMarkObject;

                if(bar.prediction == null) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#c7c7c7', background: '#c7c7c7' },
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }

                else if(bar.prediction == 0) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#654321', background: '#654321' },
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        minSize: 2
                    }
                }
                
                else if(bar.prediction == 1) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        color: { border: '#b5651d', background: '#b5651d' },
                        minSize: 2
                    }
                }

                else if(bar.prediction == 2) {
                    predictionMarkObject = {
                        id: i++,
                        time: bar.time / 1000,
                        text: `<p>Actual Label: ${bar.prediction}</p>`,
                        color: { border: '#00ccff', background: '#00ccff' },
                        minSize: 2
                    }
                }

                else if(bar.prediction == 3) {
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
        }
        
        i = 0;
        onDataCallback(marks);
        console.log(marks);
    },
}