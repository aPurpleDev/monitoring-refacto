import { initDB } from '../models/init';
import { insertOSRecords } from '../models/osModel';
import { probeSNMP } from '../services/snmpProbe';
import { insertSNMPRecords } from '../models/snmpModel';
import { router } from './router';

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
    app.listen(8060);
};

module.exports = {
    initApp
};
