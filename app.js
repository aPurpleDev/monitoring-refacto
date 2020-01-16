const server = require('./server/server.js');

//Git clone ? add `"browser": { "fs": false, }` to \node_modules\mime\package.json
server.initApp();
server.app.listen(8060);
