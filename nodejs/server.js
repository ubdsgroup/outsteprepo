"use strict";

const  express    = require('express');
const  app        = express();
const  routes     = require('./routes');

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/data', express.static('data'));
app.use(routes);

const  port  =  process.env.PORT  ||  8080;
const  server  =  app.listen(port, () => {
  console.log('Server listening at http://localhost:'  +  port);
});

