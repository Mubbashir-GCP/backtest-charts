let close = []
let closeValuesCount = 0

const closeIndicator = {
// Replace the <study name> with your study name
// The name will be used internally by the Charting Library
name: "close",
metainfo: {
    "_metainfoVersion": 40,
    "id": "close@tv-basicstudies-1",
    "scriptIdPart": "",
    "name": "close",

    // This description will be displayed in the Indicators window
    // It is also used as a "name" argument when calling the createStudy method
    "description": "close",

    // This description will be displayed on the chart
    "shortDescription": "close",

    "is_hidden_study": true,
    "is_price_study": true,
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
        "precision": 2,

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
        
        if(!isNaN(v))
            close.push(v)

        if(close.length > 3)
            close.shift()
        
        if(close.length == 3)
            close.forEach(c => sum += c)

        // console.log(close.length)
        return [(sum / 3)];
    }
}
}

export default closeIndicator;