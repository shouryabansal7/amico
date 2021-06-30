const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);

app.use('/',require('./routes/index'));

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port, function(err){
    if(err){
        //console.log('error:',err);
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});