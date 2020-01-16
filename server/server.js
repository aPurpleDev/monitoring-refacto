const initDB = require('../models/init.js').initDB;
const insertOSRecords = require('../models/osModel.js').insertOSRecords;
const probeSNMP = require('../services/snmpProbe.js').probeSNMP;
const insertSNMPRecords = require('../models/snmpModel.js').insertSNMPRecords;
const router = require('./router.js').router;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/',router);

const initApp = () => {
    console.log('initApp() call');
    initDB();
    setInterval(() => insertOSRecords(), 5000);
try{
    setInterval(() => insertSNMPRecords(probeSNMP()), 5000);
}catch(e){
    console.log("Error on SNMP Features, check that SNMP is available on your device", e);
}
};

module.exports = {
    initApp,
    app
};
