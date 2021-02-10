const { response } = require('express');
var express = require('express');
var router = express.Router();
const cors = require('cors');
const { Pool, Client } = require('pg');

// let backtestID = '58432ade-6b17-11eb-98dc-0242ac1c0002';
let backtestID;
let queryText = `with a1 as (
  select * from 
  (select "Timestamp" as nvda_time, o,h,l,c as c,v 
  from public.nvda_ohlcv where "Timestamp" > '2021-01-01') as nvda_ohlcv
  
  left join 
  
  (select *
  ,btth.date_in as btth_date_in
  ,DATE_TRUNC('minutes',btth.date_in) date_inMin
  , btth.pnl pnl_bt
  ,btth.direction btth_direction
  , btth.backtest_start btth_backtest_start
  , case when direction ='long' then (price_out - price_in) else (price_in - price_out) end pnl_2 
  ,case when (case when direction ='long' then (price_out - price_in) else (price_in - price_out) end) > 0 then 1 end as win
  ,case when (case when direction ='long' then (price_out - price_in) else (price_in - price_out) end) <0 then 1 end as loss
  from public.backtesting_trade_history btth 
  where backtest_id = $1) as btth
  
  on nvda_ohlcv.nvda_time = btth.date_inMin
  
  order by nvda_ohlcv asc) 
  
  select row_to_json(a1) from a1 limit 100`

const client = new Client({
  user: 'greencanvas',
  host: '35.223.254.139',
  database: 'greencanvas',
  password: 'r5mn)^e}WXA',
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
