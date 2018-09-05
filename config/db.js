let db = {};
db.init = config => {
    const mongoose = require('mongoose');
    const { db: { host, port, name } } = config;
    const connectionString = `mongodb://${host}:${port}/${name}`;
    mongoose.connect(connectionString,{ useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection mongodb error:'));
    db.once('open', () => console.log('connected to mongodb'));
};
module.exports = db;