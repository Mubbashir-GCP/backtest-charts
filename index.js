let params = (new URL(document.location)).searchParams;
let backtestId = params.get("backtestId");
let modelUniqueId = params.get("modelUniqueId");
let pctModelUniqueId = params.get("pctModelUniqueId");
let almPctModelUniqueId = params.get("almPctModelUniqueId");
let almPktrModelUniqueId = params.get("almPktrModelUniqueId");

if(backtestId != null) {
    document.getElementById("page_main_heading").innerHTML = 'Plot for Backtest ID: ' + backtestId;
    
    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Cumulative PNL";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Actual vs Predicted";
}

else if(pctModelUniqueId != null) {
    document.getElementById("page_main_heading").innerHTML = 'PCT Plot for Model Unique ID: ' + pctModelUniqueId;

    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Actual VS Predicted Labels";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Match/No Match";
}

else if(almPctModelUniqueId != null) {
    document.getElementById("page_main_heading").innerHTML = 'ALM PCT (Actual Labels) Plot for Model Unique ID: ' + almPctModelUniqueId;

    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Actual VS Predicted Labels";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Match/No Match";
}

else if(almPktrModelUniqueId != null) {
    document.getElementById("page_main_heading").innerHTML = 'ALM PKTR (Actual Labels) Plot for Model Unique ID: ' + almPktrModelUniqueId;

    document.getElementById("cum_pnl_or_actual_versus_predicted_labels_chart_heading").
    innerHTML = "Actual VS Predicted Labels";
    
    document.getElementById("actual_labels_chart_heading").
    innerHTML = "Actual Labels";
    
    document.getElementById("predicted_labels_chart_heading").
    innerHTML = "Predicted Labels";

    document.getElementById("match_or_no_match_chart_heading").
    innerHTML = "Match/No Match";
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