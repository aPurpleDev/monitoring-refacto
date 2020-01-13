import { getAllOSRecords, getAllSNMPRecords, getXoldestOSRecords,
    getXnewestOSRecords, getOSRecordsAboveUsage, getOSRecordsByDates,
    deleteOSTable, putDeleteXOSRecords, putDeleteOSMetricsByIds,
    getTableSizes, getTableUsage, getUserRecords
} from '../controller/controller';

const express = require('express');
const router = express.Router();

// TODO Swagger API @ router.get('/', methodTBD);

router.get('/osrecords', getAllOSRecords);

router.get('/snmprecords', getAllSNMPRecords);

router.get('/osrecords/oldest/:delimiter', getXoldestOSRecords);

router.get('/osrecords/newest/:delimiter', getXnewestOSRecords);

router.get('/osrecords/cpuusage/:cutoff', getOSRecordsAboveUsage);

router.get('/osjson/dates/:startdate/:enddate', getOSRecordsByDates);

router.delete('/osdata/delete', deleteOSTable);

router.put('/osdata/splice/cutoff', putDeleteXOSRecords);

router.put('/osdata/splice/ids', putDeleteOSMetricsByIds);

router.get('/dbrecords/tablesizes', getTableSizes);

router.get('/dbrecords/tableusage', getTableUsage);

router.get('dbrecords/userlogs', getUserRecords);

module.exports = {
    router
};
