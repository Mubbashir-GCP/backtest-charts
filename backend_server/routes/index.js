const { response } = require('express');
var express = require('express');
var router = express.Router();
const cors = require('cors');
const { Pool, Client } = require('pg');

// let backtestID = '58432ade-6b17-11eb-98dc-0242ac1c0002';
let backtestID;
let queryText = `with a1 as (
  select distinct
  "Timestamp"
  ,o
  ,h
  ,l
  ,c
  ,v
  ,date_in
  ,date_out
  ,price_in
  ,price_out
  ,direction
  ,pnl
  ,pnl_pct
  ,cum_pnl
  ,nbars
  ,prediction
  from public.view_for_backtest_charts 
  where backtest_id= $1 
  and "Timestamp" > (select min(date_trunc('day',date_in)) from view_for_backtest_charts where backtest_id= $1)
  and "Timestamp" < (select max(date_trunc('day',date_in)) from view_for_backtest_charts where backtest_id= $1)
  order by "Timestamp" asc)


  select row_to_json(a1) from a1`

const client = new Client({
  user: 'gcp_read_only',
  host: '35.223.254.139',
  database: 'greencanvas',
  password: 'gc$$2929%',
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

router.get('/chart', cors(), (req, res, next) => {
  console.log(req.query);
  backtestID = req.query.backtestId;
  return res.redirect('http://localhost:5000');
});

router.get('/backtestData', cors(), async (req, res, next) => {

  // console.log('Hello');
  let backtests_jsons = [];
  client.connect()
  .then(response => {
    console.log('Database Connection established');
  })
  .catch(error => console.log(error.message));

  let response = await client.query(queryText, [backtestID]);
  
  response.rows.forEach(row => {
    backtests_jsons = [... backtests_jsons, row.row_to_json]
  });
  console.log(backtests_jsons);
  return res.json(backtests_jsons);
  // console.log(backtestID);
  // return res.status(200).send(`Backtest ID: ${backtestID}`);
})

module.exports = router;
