import { makeApiRequest, generateSymbol, parseFullSymbol } from './helpers.js';
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

let c = 0;
let backtests_data = [];
const lastBarsCache = new Map();

// const configurationData = {
//     supported_resolutions: ['1D'],
//     exchanges: [
//         {
//             value: 'Bitfinex',
//             name: 'Bitfinex',
//             desc: 'Bitfinex',
//         },
//         {
//             // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
//             value: 'Kraken',

//             // filter name
//             name: 'Kraken',

//             // full exchange name displayed in the filter popup
//             desc: 'Kraken bitcoin exchange',
//         },
//     ],
//     // exchanges: [{value: ""}],
//     symbols_types: [
//         {
//             name: 'crypto',

//             // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
//             value: 'crypto',
//         },
//         // ...
//     ],
// };

async function getAllSymbols() {
    const data = await makeApiRequest('data/v3/all/exchanges');
    let allSymbols = [];

    for (const exchange of configurationData.exchanges) {
        const pairs = data.Data[exchange.value].pairs;

        for (const leftPairPart of Object.keys(pairs)) {
            const symbols = pairs[leftPairPart].map(rightPairPart => {
                const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
                return {
                    symbol: symbol.short,
                    full_name: symbol.full,
                    description: symbol.short,
                    exchange: exchange.value,
                    type: 'crypto',
                };
            });
            allSymbols = [...allSymbols, ...symbols];
        }
    }
    return allSymbols;
}

// export default {
//     onReady: (callback) => {
//         console.log('[onReady]: Method call');
//         setTimeout(() => callback(configurationData));
//     },
//     // onReady: (callback) => {
//     //     console.log('[onReady]: Method call');
//     //     // setTimeout(() => callback(configurationData));
//     // },
//     searchSymbols: async (userInput, value="", symbolType, onResultReadyCallback) => {
//         console.log('[searchSymbols]: Metod call');
//         const symbols = await getAllSymbols();
//         const newSymbols = symbols.filter(symbol => {
//         const isExchangeValid = exchange === '' || symbol.exchange === exchange;
//         const isFullSymbolContainsInput = symbol.full_name
//             .toLowerCase()
//             .indexOf(userInput.toLowerCase()) !== -1;
//             return isExchangeValid && isFullSymbolContainsInput;
//         });
//         onResultReadyCallback(newSymbols);
//     },
//     resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
//         console.log('[resolveSymbol]: Method call', symbolName);

//         const symbols = await getAllSymbols();
//         const symbolItem = symbols.find(({ full_name }) => full_name === symbolName);
//         if (!symbolItem) {
//             console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
//             onResolveErrorCallback('cannot resolve symbol');
//             return;
//         }
//         const symbolInfo = {
//             name: symbolItem.symbol,
//             description: symbolItem.description,
//             type: symbolItem.type,
//             session: '24x7',
//             timezone: 'Etc/UTC',
//             exchange: symbolItem.exchange,
//             minmov: 1,
//             pricescale: 100,
//             has_intraday: false,
//             has_no_volume: true,
//             has_weekly_and_monthly: false,
//             supported_resolutions: configurationData.supported_resolutions,
//             volume_precision: 2,
//             data_status: 'streaming',
//         };

//         console.log('[resolveSymbol]: Symbol resolved', symbolName);
//         onSymbolResolvedCallback(symbolInfo);
//     },
//     getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
//         console.log('[getBars]: Method call', symbolInfo);
//         // fetch('../BT_Data.json')
//         // .then(response => {
//         //     if(response.ok)
//         //         return response;
//         // })
//         // .then(response => response.json())
//         // .then(btData => {
//         //     let bars = [];

//         //     btData.forEach(tuple => {
//         //         let timestamp = new Date(tuple.Timestamp);
//         //         let time = Math.floor(timestamp.getTime() / 1000);

//         //         bars = [...bars, {
//         //             time: time,
//         //             low: tuple.low,
//         //             high: tuple.high,
//         //             open: tuple.open,
//         //             close: tuple.close,
//         //             volume: tuple.v 
//         //         }]
//         //     });
            
//         //     onHistoryCallback(bars, { noData: })
//         // })
//         // .catch(error => console.log(error));

//         const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
//         const urlParameters = {
//             e: parsedSymbol.exchange,
//             fsym: parsedSymbol.fromSymbol,
//             tsym: parsedSymbol.toSymbol,
//             toTs: to,
//             limit: 2000,
//         };
//         const query = Object.keys(urlParameters)
//             .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
//                 .join('&');
//         try {
//             const data = await makeApiRequest(`data/histoday?${query}`);
//             if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
//                 // "noData" should be set if there is no data in the requested period.
//                 onHistoryCallback([], { noData: true });
//                 return;
//             }
//             let bars = [];
//             data.Data.forEach(bar => {
//                 if (bar.time >= from && bar.time < to) {
//                     bars = [...bars, {
//                         time: bar.time * 1000,
//                         low: bar.low,
//                         high: bar.high,
//                         open: bar.open,
//                         close: bar.close,
//                     }];
//                 }
//             });
//             console.log(`[getBars]: returned ${bars.length} bar(s)`);
//             onHistoryCallback(bars, { noData: false });
//         } catch (error) {
//             console.log('[getBars]: Get error', error);
//             onErrorCallback(error);
//         }
//     },
//     subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
//         console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
//         subscribeOnStream(
//             symbolInfo,
//             resolution,
//             onRealtimeCallback,
//             subscribeUID,
//             onResetCacheNeededCallback,
//             lastBarsCache.get(symbolInfo.full_name)
//         );
//     },
//     unsubscribeBars: (subscriberUID) => {
//         console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
//         unsubscribeFromStream(subscriberUID);
//     },
// };

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

// const getBars = (mySymbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    
// }

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

        // // console.log('[searchSymbols]: Metod call');
        // // const symbols = await getAllSymbols();
        // // const newSymbols = symbols.filter(symbol => {
        // // const isExchangeValid = exchange === '' || symbol.exchange === exchange;
        // // const isFullSymbolContainsInput = symbol.full_name
        // //     .toLowerCase()
        // //     .indexOf(userInput.toLowerCase()) !== -1;
        // //     return isExchangeValid && isFullSymbolContainsInput;
        // });
        // onResultReadyCallback(symbolInfo);

        onResultReadyCallback(configurationData);
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
        console.log('[resolveSymbol]: Method call', symbolName);

        // const symbols = await getAllSymbols();
        // const symbolItem = symbols.find(({ full_name }) => full_name === symbolName);
        // if (!symbolItem) {
        //     console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
        //     onResolveErrorCallback('cannot resolve symbol');
        //     return;
        // }
        // const symbolInfo = {
        //     name: symbolItem.symbol,
        //     description: symbolItem.description,
        //     type: symbolItem.type,
        //     session: '24x7',
        //     timezone: 'Etc/UTC',
        //     exchange: symbolItem.exchange,
        //     minmov: 1,
        //     pricescale: 100,
        //     has_intraday: false,
        //     has_no_volume: false,
        //     has_weekly_and_monthly: false,
        //     supported_resolutions: configurationData.supported_resolutions,
        //     volume_precision: 2,
        //     data_status: 'streaming',
        // };

        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        
        
    },
    getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        console.log('[getBars]: Method call', symbolInfo);
        // let bars = [{
        //     time: 1611030900,
        //     low: 512,
        //     high: 524,
        //     open: 518,
        //     close: 520,
        //     volume: 25000
        // }];

        let bars = []

        // const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
        // const urlParameters = {
        //     e: parsedSymbol.exchange,
        //     fsym: parsedSymbol.fromSymbol,
        //     tsym: parsedSymbol.toSymbol,
        //     toTs: to,
        //     limit: 2000,
        // };
        // const query = Object.keys(urlParameters)
        //     .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
        //         .join('&');
        try {
            const data = await makeApiRequest();
            // if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
            //     // "noData" should be set if there is no data in the requested period.
            //     onHistoryCallback([], { noData: true });
            //     return;
            // }
            // let bars = [];

            // let bars = [{
            //     time: 1611030900,
            //     low: 512,
            //     high: 524,
            //     open: 518,
            //     close: 520,
            //     volume: 25000
            // },{
            //     time: 1611030900,
            //     low: 512,
            //     high: 524,
            //     open: 518,
            //     close: 520,
            //     volume: 25000
            // }];

            // let i = 0;
        
            // for (let i = 0; i < data.length; ++i) {
            //     let timestamp = new Date(data[i].Timestamp);
            //     let time = Math.floor(timestamp.getTime() / 1000);

            //     bars = [...bars, {
            //         time: time,
            //         low: data[i].l,
            //         high: data[i].h,
            //         open: data[i].o,
            //         close: data[i].c,
            //     }];
            // }

            // console.log(new Date('2021-01-19T09:35:00'));
            if(!data[0].hasOwnProperty('match_or_no_match')) {
                data.forEach(bar => {
                    let timestamp = new Date(bar.Timestamp);
                    let time = Math.floor(timestamp.getTime());
                    
                    // if (i < 1) {
                    //     console.log(time);
                    //     ++i;
                    // }

                    // if (bar.time >= from && bar.time < to) {
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
                            // sma20: bar.sma_20
                        }];
                    // }

                        // console.log(bar.sma_20);
                });
                console.log(`[getBars]: returned ${bars.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }
            // if(c == 0) {
            //     onHistoryCallback(bars, { noData: false });
            //     ++c;
            // }
            else {
                data.forEach(bar => {
                    let timestamp = new Date(bar.Timestamp);
                    let time = Math.floor(timestamp.getTime());
                    
                    // if (i < 1) {
                    //     console.log(time);
                    //     ++i;
                    // }

                    // if (bar.time >= from && bar.time < to) {
                        backtests_data = [...backtests_data, {
                            time: time, 
                            low: bar.l,
                            high: bar.h,
                            open: bar.o,
                            close: bar.c,
                            volume: bar.v,
                            // direction: bar.direction,
                            // pnl: bar.pnl,
                            // price_in: bar.price_in,
                            // price_out: bar.price_out,
                            // nbars: bar.nbars,
                            // prediction: bar.prediction
                            match_or_no_match: bar.match_or_no_match
                            // sma20: bar.sma_20
                        }];
                    // }

                        // console.log(bar.sma_20);
                });
                console.log(`[getBars]: returned ${bars.length} bar(s)`);
                onHistoryCallback(backtests_data, { noData: false });
            }

        } catch (error) {
            console.log('[getBars]: Get error', error);
            onErrorCallback(error);
        }

        // fetch('../BT_Data.json')
        // .then(response => response.json())
        // .then(btData => {
        //     let bars = [{
        //         time: 1611030900,
        //         low: 512,
        //         high: 524,
        //         open: 518,
        //         close: 520,
        //         volume: 25000
        //     }, {
        //         time: 1611030960,
        //         low: 522,
        //         high: 538,
        //         open: 526,
        //         close: 530,
        //         volume: 25000  
        //     }];
            // let timestamp = new Date(btData[0].Timestamp);
            // let time = Math.floor(timestamp.getTime() / 1000);
            // console.log(time)

            // btData.forEach(tuple => {
            //     let timestamp = new Date(tuple.Timestamp);
            //     let time = Math.floor(timestamp.getTime() / 1000);

            //     bars = [...bars, {
            //         time: time,
            //         low: tuple.l,
            //         high: tuple.h,
            //         open: tuple.o,
            //         close: tuple.c,
            //         volume: tuple.v 
            //     }]
            // })
            // setTimeout(() => onHistoryCallback(bars, { noData: false }));
        // })
        // .catch(error => console.log(error));


        // onHistoryCallback(bars, { noData: false });
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {

    },
    
    unsubscribeBars: (subscriberUID) => {

    },
    getMarks: async (symbolInfo, from, to, onDataCallback, resolution) => {
        console.log('[getMarks]: Method call');

        let marks = [];
        console.log(backtests_data);
        // const data = await makeApiRequest();
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
                    
                    // ++i;
                    // console.log(marks);
                }
            });
            i = 0;
            onDataCallback(marks);
            console.log(marks);
        }
        else {
            backtests_data.forEach(bar => {
                let markObject = {
                    id: i++,
                    time: bar.time / 1000,
                    color: bar.match_or_no_match == 'No match!' ? 'red' : 'green',
                    minSize: 2
                }

                marks = [...marks, markObject];
            })
            i = 0;
            onDataCallback(marks);
            console.log(marks);
        }

        // setTimeout(() => onDataCallback(marks, () => console.log("Hello")));
    },

    // getTimescaleMarks: async (symbolInfo, from, to, onDataCallback, resolution) => {
    //     console.log('[getTimescaleMarks]: Method call');

    //     let timescaleMarks = [];

    //     const data = await makeApiRequest();
    //     let i = 0;
    //     data.forEach(bar => {
    //         let timestamp = new Date(bar.Timestamp);
    //         let time = Math.floor(timestamp.getTime());

    //         if(bar.direction != null) {
    //             let markObject = {
    //                 id: i,
    //                 time: time / 1000,
    //                 color: bar.pnl >= 0 ? 'green' : 'red',
    //                 label: bar.direction == 'long' ? 'L' : 'S',
    //             }

    //             timescaleMarks = [...timescaleMarks, markObject];
    //             ++i;
    //             // console.log(marks);
    //         }
    //     });

    //     onDataCallback(timescaleMarks)
    // }
}