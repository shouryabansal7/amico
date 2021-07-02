const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/amico_development',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.set('useCreateIndex',true);
const db = mongoose.connection;

db.on('error',console.error.bind(console,"error coonecting to mongodb"));

db.once('open', function(){
    console.log('connected to database :: MongoDB')
});

module.exports = db;