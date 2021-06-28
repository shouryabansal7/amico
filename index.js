const express = require('express');
const app = express();
const port = 8000;

app.listen(port, function(err){
    if(err){
        //console.log('error:',err);
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});