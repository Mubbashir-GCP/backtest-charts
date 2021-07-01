import Datafeed from './datafeed.js';
import CumPNLDatafeed from './CumPNLDatafeed.js'; 
import ActualLabelsDatafeed from './ActualLabelsDatafeed.js';
import PredictedLabelsDatafeed from './PredictedLabelsDatafeed.js';
import MatchNoMatchDatafeed from './MatchNoMatchDatafeed.js';

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
                
                        // console.log(close.length)
                        if(lEMA.length >= 2) {
                            if(lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2] >= -0.00043573300000000005 && 
                                lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2] <= 0.000197509)
                                return [lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2]];
                            else
                                return [0]
                        }
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
                
                        console.log(volume)
                        if(ema.length >= 2)
                            if((ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2] >= -0.000479653 &&
                                (ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2] <= 0.00002004806152)
                                return [(ema[ema.length - 1] - ema[ema.length - 2]) / ema[ema.length - 2]];
                            else
                                return[0]
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
                        if(volForObv.length >= 2)
                            if((obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / 
                                obv200Arr[obv200Arr.length - 2] >= -1.176879616 &&
                                (obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / 
                                obv200Arr[obv200Arr.length - 2] <= 4.784229527)
                                    return [(obv200Arr[obv200Arr.length - 1] - obv200Arr[obv200Arr.length - 2]) / obv200Arr[obv200Arr.length - 2]];
                            else
                                return[0]
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
    window.tvWidget.chart().createStudy('diff(log(emaclose3))', false, true);
    window.tvWidget.chart().createStudy('pct(ema3close)', false, true);
    window.tvWidget.chart().createStudy('pct(obv200)', false, true);
    window.tvWidget.chart().createStudy('sigma30(pct(c))', false, true);
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