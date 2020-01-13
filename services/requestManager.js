import { selectOSRecords, selectXOldestOSRecords, selectXNewestOSRecords,
    selectOSRecordsByDates, selectOSRecordsAboveUsage, dropOSTable,
    deleteOSRecords, deleteOSRecordsBelowUsage, deleteOSRecordsByIds
   } from '../models/osModel';

import { selectSNMPRecords } from '../models/snmpModel';

import { selectDBSizes, selectOSTablePercentUsed, getUserConnections } from '../models/dbModel';

//TODO Homepage '/' route => API Swagger

//Select all records from the osmetrics table.
const getAllOSRecords = function(request, response){
    selectOSRecords().then(data => {
        response.json(data);
    }).catch(e => console.log(e));
};

//Select all records from the rammetrics table.
const getAllSNMPRecords = function(request, response){
    selectSNMPRecords().then(data => {
        response.json(data);
    }).catch(e => console.log(e));
};

//Select that returns X oldest records of the osmetrics table, where X = delimeter param of the route.
const getXoldestOSRecords = function(request, response){
    selectXOldestOSRecords(request.params.delimiter)
        .then(data => response.json(data))
        .catch((e) => console.log(console.log(e));
};

//Select that returns X newest records of the osmetrics table, where X = delimeter param of the route.
const getXnewestOSRecords = function(request, response){
    selectXNewestOSRecords(request.params.delimiter)
        .then(data => response.json(data))
        .catch((e) => console.log(console.log(e)));
};

//Select that returns records where cpuUsage was higher or equal than X, where X = cutoff param of the route.
const getOSRecordsAboveUsage = function(request, response){
    selectOSRecordsAboveUsage(request.params.cutoff)
        .then(data => response.json(data))
        .catch((e) => console.log(console.log(e)));
};

//Select that returns records created in between startdate and enddate, which are params of the route.
const getOSRecordsByDates = function(request, response){
    selectOSRecordsByDates(request.params.startdate, request.params.enddate)
        .then(data => response.json(data))
        .catch((e) => console.log(console.log(e)));
};

//Delete all records from the osmetrics table
const deleteOSTable = function(request, response){
    response.send({type: 'DELETE', message: 'Deletion of OS Data Table'});
    dropOSTable()
        .then(() => console.log('DELETE request received and processed'))
        .catch((e) => console.log(console.log(e)));
};

//Delete X oldest records from the osmetrics table, where X = cutoff
const putDeleteXOSRecords = function(request, response){

    if (request.body.hasOwnProperty('cutoff')) {
        let cutoff = request.body.cutoff;

        if (!Number.isNaN(parseInt(cutoff))) {

            deleteOSRecords(cutoff).catch((e) => console.log(e));
            response.json({'message': `Successfully deleted the ${parseInt(cutoff)} oldest records of osmetrics table`});
        } else {
            response.status(400);
            response.send({'Bad Request Error': `Enter an Interger number in cutoff value for the request to be processed. Input denied`});
        }
    } else if (request.body.hasOwnProperty('targetUsage')) {
        if (parseInt(request.body.targetUsage)) {
            deleteOSRecordsBelowUsage(request.body.targetUsage).catch((e) => console.log(e));
            response.json({'message': `Successfully deleted records of cpu usage lower than ${parseInt(request.body.targetUsage)} in osmetrics table`});
        } else {
            response.status(400);
            response.send({'Bad Request Error': `targetUsage doesn't match acceptable format. Must be a number`});
        }
    } else {
        response.status(400);
        response.send({
            'Bad Request Error': `No cutoff found or targetUsage found. 
        Add a "cutoff" or "targetUsage" key to your request body for the server to process your request. 
        Cutoff must be a number and targetDate a parsable date format.`
        });
    }
};

//Route that deletes as many entry as IDs matching in the request body
const putDeleteOSMetricsByIds = function(request, response){
    if (request.body.hasOwnProperty('ids')) {
        let ids = request.body.ids;
        try{
            deleteOSRecordsByIds(ids);
        }catch(e)
        {
            console.log("Error on try/catch route splcie Ids:", e);
        }
        response.json({'message': `Successfully deleted ids submitted in request: ${ids.toString()}`});
    }else{
        response.status(400);
        response.send({'Bad Request Error': `Enter valid IDs seperated by a comma ',' for the request to be processed. Input denied`});
    }
};

//Selects all collection names and sizes within the database
const getTableSizes = function(request, response){
    selectDBSizes().then((data) => response.json(data))
        .catch((e) => console.log(e));
};

//Selects the osmetrics table index % usage and its rows count
const getTableUsage = function(request, response){
    selectOSTablePercentUsed().then((data) => response.json(data))
        .catch((e) => console.log(e));
};

//Selects all records of user connections in the database
const getUserRecords = function(request, response){
   getUserConnections().then((data) => response.json(data))
        .catch((e) => console.log(e));
};

module.exports = {
    getAllOSRecords,
    getAllSNMPRecords,
    getXoldestOSRecords,
    getXnewestOSRecords,
    getOSRecordsAboveUsage,
    getOSRecordsByDates,
    deleteOSTable,
    putDeleteXOSRecords,
    putDeleteOSMetricsByIds,
    getTableSizes,
    getTableUsage,
    getUserRecords
};
