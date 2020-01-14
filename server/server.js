import { initDB } from '../models/init.js';
import { insertOSRecords } from '../models/osModel.js';
import { probeSNMP } from '../services/snmpProbe.js';
import { insertSNMPRecords } from '../models/snmpModel.js';
import { router } from './router.js';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/',router);

initDB();

const initApp = () => {
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
