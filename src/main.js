import Datafeed from './datafeed.js';
import CumPNLDatafeed from './CumPNLDatafeed.js'; 
import ActualLabelsDatafeed from './ActualLabelsDatafeed.js';
import PredictedLabelsDatafeed from './PredictedLabelsDatafeed.js';
import MatchNoMatchDatafeed from './MatchNoMatchDatafeed.js';

// import { studyTemplate } from './ordersStudy.js';

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'tv_chart_container',
    datafeed: Datafeed,
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'cum_pnl_chart_container',
    datafeed: CumPNLDatafeed,
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'actual_labels_chart_container',
    datafeed: ActualLabelsDatafeed,
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'predicted_labels_chart_container',
    datafeed: PredictedLabelsDatafeed,
    library_path: '../charting_library_clonned_data/charting_library/',
});

window.tvWidget = new TradingView.widget({
    symbol: 'NVDA',
    interval: '1', // default symbol // default interval
    fullscreen: true, // displays the chart in the fullscreen mode
    container_id: 'match_no_match_chart_container',
    datafeed: MatchNoMatchDatafeed,
    library_path: '../charting_library_clonned_data/charting_library/',
});