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
            let markObject = {
                id: i++,
                time: bar.time / 1000,
                color: bar.match_or_no_match == 'No Match!' ? { border: '#d63c2d', background: '#d63c2d' } : 
                                                              { border: '#32cd32', background: '#32cd32' },
                text: `<p>${bar.match_or_no_match}</p>`,
                minSize: 2
            }            
        });

        i = 0;
        onDataCallback(marks);
        console.log(marks);
    }
}