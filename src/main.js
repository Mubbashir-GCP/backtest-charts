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
let closeValuesCount = 0

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
                                "plottype": 2,
                
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
                        
                        if(close.length == 3)
                            close.forEach(c => sum += c)

                            let first_part = close[close.length - 1] * multiplier
                            let second_part = ema.length == 0 ? ((sum / 3) * (1 - multiplier)) : ema[ema.length - 1] * (1 - multiplier);
                            
                            ema.push[(first_part + second_part)]
                            let logEma = Math.log((first_part + second_part))
                            lEMA.push(logEma)
                
                        // console.log(close.length)
                        if(lEMA.length >= 2)
                        return [lEMA[lEMA.length - 1] - lEMA[lEMA.length - 2]];
                    }
                }
            }
        ]);
    },
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget.onChartReady(function() {
    window.tvWidget.chart().createStudy('diff(log(emaclose3))', false, true);
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