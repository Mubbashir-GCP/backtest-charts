const { response } = require('express');
const fs = require('fs');
var express = require('express');
var router = express.Router();
const cors = require('cors');
const { Pool, Client } = require('pg');
// '5946aa64-6d74-11eb-93bd-0242ac1c0002'
let pktrQueryText = `with a1 as (select * from public.consolidated_results_pt
  where  model_unique_id = $1
  order by timestamps asc)

select row_to_json(a1) from a1 
`

let pctQueryText = `with a1 as (select * from public.consolidated_results
  where  model_unique_id = $1 
  order by timestamps asc)

select row_to_json(a1) from a1`;

let backtestQueryText = `with a1 as (
  select distinct * from get_chart_data($1)
  order by timestamp_ asc)

  select row_to_json(a1) from a1`;

let almPctQueryText = `with a1 as (
  select * from public.consolidated_results_alm
  where model_unique_id = $1 order by timestamps asc limit 1000)
  
  select row_to_json(a1) from a1`;

let almPktrQueryText = `with a1 as (
  select * from public.consolidated_results_alm_pt
  where model_unique_id = $1
   order by timestamps asc limit 1000)
  
  select row_to_json(a1) from a1`;

let getSigmasText = `with a1 as (
  select datetime, sigma30_pct_c, diff_log_ema3_close,
  pct_ema3close_ema3close_1, pct_chng_obv200_obv200_1 from public.indicators_for_charting 
  where bt_id = $1
  and datetime >= '2021-06-21'::timestamp
  order by datetime asc)
  
  select row_to_json(a1) from a1`;

let graphType;

// let backtestID = '58432ade-6b17-11eb-98dc-0242ac1c0002';
let modelUniqueId = '';
let backtestId = '';
let pctModelUniqueId = '';
let almPctModelUniqueId = '';
let almPktrModelUniqueId = '';

const client = new Client({
  user: 'gcpv1_mubbashir',
  host: 'gcp01.dynamic-dns.net',
  database: 'greencanvas',
  password: 'gc$$32145#5',
  port: 5432
});

const corsOption = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/backtestChart', cors(), (req, res, next) => {
  console.log(req.query);
  backtestId = req.query.backtestId;
  graphType = 'Backtest';
  console.log(backtestId);
  
  return res.redirect('http://localhost:5000?backtestId=' + backtestId);
});

router.get('/pktrChart', cors(), (req, res, next) => {
  console.log(req.query);
  modelUniqueId = req.query.modelUniqueId;
  graphType = 'Pktr'
  console.log(modelUniqueId);
  
  return res.redirect('http://localhost:5000?modelUniqueId=' + modelUniqueId);
});

router.get('/pctChart', cors(), (req, res, next) => {
  console.log(req.query);
  pctModelUniqueId = req.query.pctModelUniqueId;
  graphType = 'PCT'
  console.log(pctModelUniqueId);
  
  return res.redirect('http://localhost:5000?pctModelUniqueId=' + pctModelUniqueId);
});

router.get('/almPctChart', cors(), (req, res, next) => {
  console.log(req.query);
  almPctModelUniqueId = req.query.almPctModelUniqueId;
  graphType = 'ALM_PCT'
  console.log(almPctModelUniqueId);
  
  return res.redirect('http://localhost:5000?almPctModelUniqueId=' + almPctModelUniqueId);
});

router.get('/almPktrChart', cors(), (req, res, next) => {
  console.log(req.query);
  almPktrModelUniqueId = req.query.almPktrModelUniqueId;
  graphType = 'ALM_PKTR'
  console.log(almPktrModelUniqueId);
  
  return res.redirect('http://localhost:5000?almPktrModelUniqueId=' + almPktrModelUniqueId);
});

router.get('/getSigmas', cors(), async (req, res, next) => {
  client.connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch(error => console.log(error.message));

  let indicatorsJsons = [];

  let response;
  response = await client.query(getSigmasText, [backtestId]);

  response.rows.forEach(row => {
    indicatorsJsons = [... indicatorsJsons, row.row_to_json]
  });

  console.log(indicatorsJsons);

  if(indicatorsJsons.length == 0)
    return res.json({noData: true});
  else
    return res.json(indicatorsJsons);
})

router.get('/backtestData', cors(), async (req, res, next) => {

  // console.log('Hello');
  let backtests_jsons = [];
  client.connect()
  .then(response => {
    console.log('Database Connection established');
  })
  .catch(error => console.log(error.message));
  let response;

  if(graphType == 'Backtest') 
    response = await client.query(backtestQueryText, [backtestId]);
  else if(graphType == 'PCT')
    response = await client.query(pctQueryText, [pctModelUniqueId]);
  else if(graphType == 'Pktr')
    response = await client.query(pktrQueryText, [modelUniqueId]);
  else if(graphType == 'ALM_PCT')
    response = await client.query(almPctQueryText, [almPctModelUniqueId]);
  else if(graphType == 'ALM_PKTR')
    response = await client.query(almPktrQueryText, [almPktrModelUniqueId]);
  
  response.rows.forEach(row => {
    backtests_jsons = [... backtests_jsons, row.row_to_json]
  });
  
  // console.log(backtests_jsons);
  console.log('No. of rows returned: ' + backtests_jsons.length);

  // fs.writeFileSync('/home/mubbashir/Projects/backtest-charts/backend_server/temp_backtest_data.json', JSON.stringify(backtests_jsons))

  if(backtests_jsons.length == 0)
    return res.json({noData: true});
  else
    return res.json(backtests_jsons);
  // console.log(backtestID);
  // return res.status(200).send(`Backtest ID: ${backtestID}`);
})

module.exports = router;
