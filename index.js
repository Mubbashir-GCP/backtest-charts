let params = (new URL(document.location)).searchParams;
let backtestId = params.get("backtestId");
let modelUniqueId = params.get("modelUniqueId");

if(backtestId != null) {
    document.getElementById("page_main_heading").innerHTML = 'Plot for Backtest ID: ' + backtestId;
    
    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Cumulative PNL";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels (Not Applicable)";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels (Not Applicable)";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Match/No Match (Not Applicable)";
}
else {
    document.getElementById("page_main_heading").innerHTML = 'PKTR Plot for Model Unique ID: ' + modelUniqueId;

    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Actual VS Predicted Labels";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Match/No Match";
}