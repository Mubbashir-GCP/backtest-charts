import Datafeed from './datafeed.js';
import CumPNLDatafeed from './CumPNLDatafeed.js'; 
import ActualLabelsDatafeed from './ActualLabelsDatafeed.js';
import PredictedLabelsDatafeed from './PredictedLabelsDatafeed.js';
import MatchNoMatchDatafeed from './MatchNoMatchDatafeed.js';
import { indicators } from './helpers.js'

let sigma30_pct_c_count = 0;
let diff_log_ema3_close_count = 0
let pct_ema3_close_count = 0
let pct_chng_obv200_count = 0;
// x = thisdict["STRATEGY"].get('TRANSLATION', None)
// res = re.findall(r"'([^']+)'", x)

// res_new = res 
let close = []
let ema = []
let lEMA = []
let obv200 = 0
let volForObv = []
let obv200Arr = []
let pctC = []

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'tv_chart_container',
    datafeed: Datafeed,
    custom_indicators_getter: function(PineJS) {
        return Promise.resolve([
            // *** your indicator object, created from the template ***
            {
                // Replace the <study name> with your study name
                // The name will be used internally by the Charting Library
                name: "diff(log(emaclose3))",
                metainfo: {
                    "_metainfoVersion": 40,
                    "id": "diff(log(emaclose3))@tv-basicstudies-1",
                    "scriptIdPart": "",
                    "name": "diff(log(emaclose3))",
                
                    // This description will be displayed in the Indicators window
                    // It is also used as a "name" argument when calling the createStudy method
                    "description": "diff(log(emaclose3))",
                
                    // This description will be displayed on the chart
                    "shortDescription": "diff(log(emaclose3))",
                
                    "is_hidden_study": true,
                    "is_price_study": false,
                    "isCustomIndicator": true,
                
                    "plots": [{"id": "plot_0", "type": "line", }],
                    "defaults": {
                        "styles": {
                            "plot_0": {
                                "linestyle": 0,
                                "visible": true,
                
                                // Plot line width.
                                "linewidth": 2,
                
                                // Plot type:
                                //    1 - Histogram
                                //    2 - Line
                                //    3 - Cross
                                //    4 - Area
                                //    5 - Columns
                                //    6 - Circles
                                //    7 - Line With Breaks
                                //    8 - Area With Breaks
                                "plottype": 5,
                
                                // Show price line?
                                "trackPrice": false,
                
                                // Plot transparency, in percent.
                                "transparency": 40,
                
                                // Plot color in #RRGGBB format
                                "color": "#0000FF"
                            }
                        },
                        // Precision of the study's output values
                        // (quantity of digits after the decimal separator).
                        "precision": 6,
                
                        "inputs": {}
                    },
                    "styles": {
                        "plot_0": {
                            // Output name will be displayed in the Style window
                            "title": "Close Value",
                            "histogramBase": 0,
                        }
                    },
                    "inputs": [],
                },
                
                constructor: function() {
                    this.init = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        // Define the symbol to be plotted.
                        // Symbol should be a string.
                        // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
                        // For example,
                        //    var symbol = "AAPL";
                        //    var symbol = "#EQUITY";
                        //    var symbol = PineJS.Std.ticker(this._context) + "#TEST";
                        var symbol = "#Close";
                        this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
                    };
                
                    this.main = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        this._context.select_sym(1);
                
                        // You can use following built-in functions in PineJS.Std object:
                        //    open, high, low, close
                        //    hl2, hlc3, ohlc4
                        // var multiplier = 2 / (3 + 1)
                
                        var v = PineJS.Std.close(this._context);
                        let sum = 0
                        let multiplier = (2 / 4)
                        
                        if(!isNaN(v))
                            close.push(v)
                
                        if(close.length > 3)
                            close.shift()
                        
                        if(close.length == 3) {
                            close.forEach(c => sum += c)

                            let first_part = close[close.length - 1] * multiplier
                            let second_part = ema.length == 0 ? ((sum / 3) * (1 - multiplier)) : ema[ema.length - 1] * (1 - multiplier);
                            
                            ema.push(first_part + second_part)
                            let logEma = Math.log((first_part + second_part))
                            lEMA.push(logEma)
                        }

                        
                        
                        // let indicatorValues = null;
                        
                        // indicators.forEach(indctr => {
                        //     if(new Date(indctr.date_in) == new Date(PineJS.Std.time(this._context))) {
                        //         indicatorValues = indctr.sigmas
                        //     }

                        //     return[JSON.parse(indctr.sigmas[0])['sigma30(pct(c))']]
                        //     // let date = new Date(indctr.date_in);

                        // //     console.log(new Date(date.getTime() - 18000000))
                        // //     console.log(indctr.date_in)
                        // })


                        // console.log(indicatorValues)
                        // let date = Date(PineJS.Std.time(this._context))
                        // if(PineJS.Std.close(this._context)) {
                        //     return[JSON.parse(indicators[i].sigmas)['pct(close[0]-open[0])']]
                        //     ++i
                        // }

                        // console.log()
                        // console.log(JSON.parse(indicators[0].sigmas)['pct(close[0]-open[0])'])
                        // if(lEMA.length >= 2) {
                        //     if(lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2] >= -0.00043573300000000005 && 
                        //         lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2] <= 0.000197509)
                        //         return [lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2]];
                        //     else
                        //         return [0]
                        // }

                        

                        if(new Date(PineJS.Std.time(this._context)) && diff_log_ema3_close_count < indicators.length) {
                            // console.log(new Date(PineJS.Std.time(this._context)))
                            // console.log(new Date(indicators[diff_log_ema3_close_count].datetime))
                            // console.log(indicators[diff_log_ema3_close_count].diff_log_ema3_close)

                            if(indicators[diff_log_ema3_close_count].diff_log_ema3_close >= -0.00043573300000000005 &&
                                indicators[diff_log_ema3_close_count].diff_log_ema3_close <= 0.000197509)
                                return[indicators[diff_log_ema3_close_count++].diff_log_ema3_close]
                            else {
                                ++diff_log_ema3_close_count;
                                return[0]
                            }
                        }

                        return[0];
                    }
                }
            },

            // Indicator Object for Pct(ema3Close)

            {
                // Replace the <study name> with your study name
                // The name will be used internally by the Charting Library
                name: "pct(ema3close)",
                metainfo: {
                    "_metainfoVersion": 40,
                    "id": "pct(ema3close)@tv-basicstudies-1",
                    "scriptIdPart": "",
                    "name": "pct(ema3close)",
                
                    // This description will be displayed in the Indicators window
                    // It is also used as a "name" argument when calling the createStudy method
                    "description": "pct(ema3close)",
                
                    // This description will be displayed on the chart
                    "shortDescription": "pct(ema3close)",
                
                    "is_hidden_study": true,
                    "is_price_study": false,
                    "isCustomIndicator": true,
                
                    "plots": [{"id": "plot_0", "type": "line"}],
                    "defaults": {
                        "styles": {
                            "plot_0": {
                                "linestyle": 0,
                                "visible": true,
                
                                // Plot line width.
                                "linewidth": 2,
                
                                // Plot type:
                                //    1 - Histogram
                                //    2 - Line
                                //    3 - Cross
                                //    4 - Area
                                //    5 - Columns
                                //    6 - Circles
                                //    7 - Line With Breaks
                                //    8 - Area With Breaks
                                "plottype": 5,
                
                                // Show price line?
                                "trackPrice": false,
                
                                // Plot transparency, in percent.
                                "transparency": 40,
                
                                // Plot color in #RRGGBB format
                                "color": "#0000FF"
                            }
                        },
                
                        // Precision of the study's output values
                        // (quantity of digits after the decimal separator).
                        "precision": 6,
                
                        "inputs": {}
                    },
                    "styles": {
                        "plot_0": {
                            // Output name will be displayed in the Style window
                            "title": "pct(ema3close)",
                            "histogramBase": 0,
                        }
                    },
                    "inputs": [],
                },
                
                constructor: function() {
                    this.init = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        // Define the symbol to be plotted.
                        // Symbol should be a string.
                        // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
                        // For example,
                        //    var symbol = "AAPL";
                        //    var symbol = "#EQUITY";
                        //    var symbol = PineJS.Std.ticker(this._context) + "#TEST";
                        var symbol = "#pct(ema3close)";
                        this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
                    };
                
                    this.main = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        this._context.select_sym(1);
                
                        // You can use following built-in functions in PineJS.Std object:
                        //    open, high, low, close
                        //    hl2, hlc3, ohlc4
                        // var multiplier = 2 / (3 + 1)
                
                        var v = PineJS.Std.close(this._context);
                        let volume = PineJS.Std.volume(this._context)
                        let sum = 0
                        let multiplier = (2 / 4)
                        
                        if(!isNaN(v))
                            close.push(v)
                
                        if(close.length > 3)
                            close.shift()
                        
                        if(close.length == 3) {
                            close.forEach(c => sum += c)

                            let first_part = close[close.length - 1] * multiplier
                            let second_part = ema.length == 0 ? ((sum / 3) * (1 - multiplier)) : ema[ema.length - 1] * (1 - multiplier);
                            
                            ema.push(first_part + second_part)
                            let logEma = Math.log((first_part + second_part))
                            lEMA.push(logEma)
                        }
                
                        // console.log(volume)
                        // if(ema.length >= 2)
                        //     if((ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2] >= -0.000479653 &&
                        //         (ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2] <= 0.00002004806152)
                        //         return [(ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2]];
                        //     else
                        //         return[0]

                        if(new Date(PineJS.Std.time(this._context)) && pct_ema3_close_count < indicators.length) {
                            // console.log(new Date(PineJS.Std.time(this._context)))
                            // console.log(new Date(indicators[diff_log_ema3_close_count].datetime))
                            // console.log(indicators[diff_log_ema3_close_count].diff_log_ema3_close)

                            if(indicators[pct_ema3_close_count].pct_ema3close_ema3close_1 >= -0.000479653 &&
                                indicators[pct_ema3_close_count].pct_ema3close_ema3close_1 <= 0.00002004806152)
                                return[indicators[pct_ema3_close_count++].pct_ema3close_ema3close_1]
                            else {
                                ++pct_ema3_close_count;
                                return[0]
                            }
                        }

                        return[0];
                    }
                }
            },

            // Indicator Object for Pct(Obv200)

            {
                // Replace the <study name> with your study name
                // The name will be used internally by the Charting Library
                name: "pct(obv200)",
                metainfo: {
                    "_metainfoVersion": 40,
                    "id": "pct(obv200)@tv-basicstudies-1",
                    "scriptIdPart": "",
                    "name": "pct(obv200)",
                
                    // This description will be displayed in the Indicators window
                    // It is also used as a "name" argument when calling the createStudy method
                    "description": "pct(obv200)",
                
                    // This description will be displayed on the chart
                    "shortDescription": "pct(obv200)",
                
                    "is_hidden_study": true,
                    "is_price_study": false,
                    "isCustomIndicator": true,
                
                    "plots": [{"id": "plot_0", "type": "line"}],
                    "defaults": {
                        "styles": {
                            "plot_0": {
                                "linestyle": 0,
                                "visible": true,
                
                                // Plot line width.
                                "linewidth": 2,
                
                                // Plot type:
                                //    1 - Histogram
                                //    2 - Line
                                //    3 - Cross
                                //    4 - Area
                                //    5 - Columns
                                //    6 - Circles
                                //    7 - Line With Breaks
                                //    8 - Area With Breaks
                                "plottype": 5,
                
                                // Show price line?
                                "trackPrice": false,
                
                                // Plot transparency, in percent.
                                "transparency": 40,
                
                                // Plot color in #RRGGBB format
                                "color": "#0000FF"
                            }
                        },
                
                        // Precision of the study's output values
                        // (quantity of digits after the decimal separator).
                        "precision": 6,
                
                        "inputs": {}
                    },
                    "styles": {
                        "plot_0": {
                            // Output name will be displayed in the Style window
                            "title": "pct(obv200)",
                            "histogramBase": 0,
                        }
                    },
                    "inputs": [],
                },
                
                constructor: function() {
                    this.init = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        // Define the symbol to be plotted.
                        // Symbol should be a string.
                        // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
                        // For example,
                        //    var symbol = "AAPL";
                        //    var symbol = "#EQUITY";
                        //    var symbol = PineJS.Std.ticker(this._context) + "#TEST";
                        var symbol = "#pct(obv200)";
                        this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
                    };
                
                    this.main = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        this._context.select_sym(1);
                
                        // You can use following built-in functions in PineJS.Std object:
                        //    open, high, low, close
                        //    hl2, hlc3, ohlc4
                        // var multiplier = 2 / (3 + 1)
                
                        var v = PineJS.Std.close(this._context);
                        let volume = PineJS.Std.volume(this._context)
                        let sum = 0
                        let multiplier = (2 / 4)
                        
                        if(!isNaN(v) || !isNaN(volume)) {
                            close.push(v)
                            volForObv.push(volume)
                            if(close[close.length - 1] > close[close.length - 2])
                                obv200 += volume
                            else if(close[close.length - 1] < close[close.length - 2])
                                obv200 -= volume

                            obv200Arr.push(obv200)
                        }

                        if(obv200Arr.length > 200)
                            obv200Arr.shift()

                        // if(close.length > 3)
                        //     close.shift()
                        
                        // if(close.length == 3) {
                        //     close.forEach(c => sum += c)

                        //     let first_part = close[close.length - 1] * multiplier
                        //     let second_part = ema.length == 0 ? ((sum / 3) * (1 - multiplier)) : ema[ema.length - 1] * (1 - multiplier);
                            
                        //     ema.push(first_part + second_part)
                        //     let logEma = Math.log((first_part + second_part))
                        //     lEMA.push(logEma)
                        // }
                
                        // console.log(volume)
                        // if(volForObv.length >= 2)
                        //     if((obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / 
                        //         obv200Arr[obv200Arr.length - 2] >= -1.176879616 &&
                        //         (obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / 
                        //         obv200Arr[obv200Arr.length - 2] <= 4.784229527)
                        //             return [(obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / obv200Arr[obv200Arr.length - 2]];
                        //     else
                        //         return[0]

                        if(new Date(PineJS.Std.time(this._context)) && pct_chng_obv200_count < indicators.length) {
                            // console.log(new Date(PineJS.Std.time(this._context)))
                            // console.log(new Date(indicators[diff_log_ema3_close_count].datetime))
                            // console.log(indicators[diff_log_ema3_close_count].diff_log_ema3_close)

                            if(indicators[pct_chng_obv200_count].pct_chng_obv200_obv200_1 >= -1.176879616 &&
                                indicators[pct_chng_obv200_count].pct_chng_obv200_obv200_1 <= 4.784229527)
                                return[indicators[pct_chng_obv200_count++].pct_chng_obv200_obv200_1]
                            else {
                                ++pct_chng_obv200_count;
                                return[0]
                            }
                        }

                        return[0];
                    }
                }
            },

            // Indicator Object for sigma30(pct(c))

            {
                // Replace the <study name> with your study name
                // The name will be used internally by the Charting Library
                name: "sigma30(pct(c))",
                metainfo: {
                    "_metainfoVersion": 40,
                    "id": "sigma30(pct(c))@tv-basicstudies-1",
                    "scriptIdPart": "",
                    "name": "sigma30(pct(c))",
                
                    // This description will be displayed in the Indicators window
                    // It is also used as a "name" argument when calling the createStudy method
                    "description": "sigma30(pct(c))",
                
                    // This description will be displayed on the chart
                    "shortDescription": "sigma30(pct(c))",
                
                    "is_hidden_study": true,
                    "is_price_study": false,
                    "isCustomIndicator": true,
                
                    "plots": [{"id": "plot_0", "type": "line"}],
                    "defaults": {
                        "styles": {
                            "plot_0": {
                                "linestyle": 0,
                                "visible": true,
                
                                // Plot line width.
                                "linewidth": 2,
                
                                // Plot type:
                                //    1 - Histogram
                                //    2 - Line
                                //    3 - Cross
                                //    4 - Area
                                //    5 - Columns
                                //    6 - Circles
                                //    7 - Line With Breaks
                                //    8 - Area With Breaks
                                "plottype": 5,
                
                                // Show price line?
                                "trackPrice": false,
                
                                // Plot transparency, in percent.
                                "transparency": 40,
                
                                // Plot color in #RRGGBB format
                                "color": "#0000FF"
                            }
                        },
                
                        // Precision of the study's output values
                        // (quantity of digits after the decimal separator).
                        "precision": 6,
                
                        "inputs": {}
                    },
                    "styles": {
                        "plot_0": {
                            // Output name will be displayed in the Style window
                            "title": "sigma30(pct(c))",
                            "histogramBase": 0,
                        }
                    },
                    "inputs": [],
                },
                
                constructor: function() {
                    this.init = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        // Define the symbol to be plotted.
                        // Symbol should be a string.
                        // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
                        // For example,
                        //    var symbol = "AAPL";
                        //    var symbol = "#EQUITY";
                        //    var symbol = PineJS.Std.ticker(this._context) + "#TEST";
                        var symbol = "#sigma30(pct(c))";
                        this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
                    };
                
                    this.main = function(context, inputCallback) {
                        this._context = context;
                        this._input = inputCallback;
                
                        this._context.select_sym(1);
                
                        // You can use following built-in functions in PineJS.Std object:
                        //    open, high, low, close
                        //    hl2, hlc3, ohlc4
                        // var multiplier = 2 / (3 + 1)
                
                        var v = PineJS.Std.close(this._context);
                        let volume = PineJS.Std.volume(this._context)
                        let sum = 0
                        let multiplier = (2 / 4)

                        let indicatorValues = null;
                        
                        // for(let i = 0; i < indicators.length; ++i) {
                            
                        //     if(new Date(indicators[i].datetime) === new Date(PineJS.Std.time(this._context))) {
                        //         console.log(new Date(indicators[i].datetime))
                        //         console.log(new Date(PineJS.Std.time(this._context)))
                        //         console.log(indicators[i].sigma30_pct_c)

                        //         indicatorValues = indicators[i].sigma30_pct_c
                        //         break;
                        //     }

                            
                        //     // let date = new Date(indctr.date_in);

                        // //     console.log(new Date(date.getTime() - 18000000))
                        // //     console.log(indctr.date_in)
                        // }

                        if(new Date(PineJS.Std.time(this._context)) && sigma30_pct_c_count < indicators.length) {
                            console.log(new Date(PineJS.Std.time(this._context)))
                            console.log(new Date(indicators[sigma30_pct_c_count].datetime))
                            console.log(indicators[sigma30_pct_c_count].sigma30_pct_c)

                            if(indicators[sigma30_pct_c_count].sigma30_pct_c >= 0.000290698 &&
                                indicators[sigma30_pct_c_count].sigma30_pct_c <= 0.000678001)
                                return[indicators[sigma30_pct_c_count++].sigma30_pct_c]
                            else {
                                ++sigma30_pct_c_count;
                                return[0]
                            }
                        }

                        return[0];
                        
                        if(!isNaN(v)) 
                            close.push(v)
    
                        if(close.length >= 2)
                            pctC.push((close[close.length - 1] - close[close.length - 2]) / close[close.length - 2])
                        
                        if(pctC.length > 30) 
                            pctC.shift()

                        if(pctC.length == 30) {
                            pctC.forEach(c => sum += c);
                            let mean = sum / 30;

                            let numerator = 0

                            pctC.forEach(c => numerator += (c - mean) * (c - mean))

                            if(Math.sqrt((numerator / 29)) >= 0.000290698 && Math.sqrt((numerator / 29)) <= 0.000678001)
                                return[Math.sqrt((numerator / 29))]
                            else
                                return[0]
                        }
                        

                        //     let first_part = close[close.length - 1] * multiplier
                        //     let second_part = ema.length == 0 ? ((sum / 3) * (1 - multiplier)) : ema[ema.length - 1] * (1 - multiplier);
                            
                        //     ema.push(first_part + second_part)
                        //     let logEma = Math.log((first_part + second_part))
                        //     lEMA.push(logEma)
                        // }
                
                        // console.log(volume)
                    }
                }
            }
        ]);
    },
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget.onChartReady(function() {
    // window.tvWidget.chart().createStudy('diff(log(emaclose3))', false, true);
    // window.tvWidget.chart().createStudy('pct(ema3close)', false, true);
    // window.tvWidget.chart().createStudy('pct(obv200)', false, true);
    // window.tvWidget.chart().createStudy('sigma30(pct(c))', false, true);
})

// window.tvWidget = new TradingView.widget({
//     symbol: 'NVDA',
//     interval: '1', // default symbol // default interval
//     fullscreen: true, // displays the chart in the fullscreen mode
//     container_id: 'cum_pnl_chart_container',
//     datafeed: CumPNLDatafeed,
//     library_path: '../charting_library_clonned_data/charting_library/',
// });

// window.tvWidget = new TradingView.widget({
//     symbol: 'NVDA',
//     interval: '1', // default symbol // default interval
//     fullscreen: true, // displays the chart in the fullscreen mode
//     container_id: 'actual_labels_chart_container',
//     datafeed: ActualLabelsDatafeed,
//     library_path: '../charting_library_clonned_data/charting_library/',
// });

// window.tvWidget = new TradingView.widget({
//     symbol: 'NVDA',
//     interval: '1', // default symbol // default interval
//     fullscreen: true, // displays the chart in the fullscreen mode
//     container_id: 'predicted_labels_chart_container',
//     datafeed: PredictedLabelsDatafeed,
//     library_path: '../charting_library_clonned_data/charting_library/',
// });

// window.tvWidget = new TradingView.widget({
//     symbol: 'NVDA',
//     interval: '1', // default symbol // default interval
//     fullscreen: true, // displays the chart in the fullscreen mode
//     container_id: 'match_no_match_chart_container',
//     datafeed: MatchNoMatchDatafeed,
//     library_path: '../charting_library_clonned_data/charting_library/',
// });