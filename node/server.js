let io = require('socket.io');
const http = require('http');
const promise = require('bluebird');
const initOptions = {
    promiseLib: promise
};
const pg = require('pg-promise')(initOptions);


const config = {
    host: 'localhost',
    user: 'graph',
    database: 'graph',
    password: 'graph',
    port: 5432
};
const db = pg(config);

const app = http.createServer();
io = io.listen(app);
app.listen(8803);

io.sockets.on('connection', function(socket) {
    socket.on('graphServer', function (data) {
        if (data.type && data.id) {
            switch(data.type) {
                case 'node':
                    db.oneOrNone('select * from graphs where id = $1', [data.id])
                        .then(row => {
                            if (!row) {
                                socket.emit('graphClient', {type: 'error', info: 'row not found'});
                            } else {
                                if (data.node) {
                                    let nodes = [];
                                    if (row.nodes != null) {
                                        nodes = JSON.parse(row.nodes);
                                    }
                                    nodes.push(data.node);
                                    db.none('update graphs set nodes = $1 where id = $2', [JSON.stringify(nodes), data.id]);
                                    socket.broadcast.emit('graphClient', {type: 'node', node: data.node});
                                    socket.emit('graphClient', {type: 'succes'});
                                } else {
                                    socket.emit('graphClient', {type: 'error', info: 'node not found'});
                                }
                            }
                        });
                    break;
                case 'edge':
                    db.oneOrNone('select * from graphs where id = $1', [data.id])
                        .then(row => {
                            if (!row) {
                                socket.emit('graphClient', {type: 'error', info: 'row not found'});
                            } else {
                                if (data.edge) {
                                    let edges = [];
                                    if (row.edges != null) {
                                        edges = JSON.parse(row.edges);
                                    }
                                    edges.push(data.edge);
                                    db.none('update graphs set edges = $1 where id = $2', [JSON.stringify(edges), data.id]);
                                    socket.broadcast.emit('graphClient', {type: 'edge', edge: data.edge});
                                    socket.emit('graphClient', {type: 'succes'});
                                } else {
                                    socket.emit('graphClient', {type: 'error', info: 'edge not found'});
                                }
                            }
                        });
                    break;
                case 'pos':
                    db.oneOrNone('select * from graphs where id = $1', [data.id])
                        .then(row => {
                            if (!row) {
                                socket.emit('graphClient', {type: 'error', info: 'row not found'});
                            } else {
                                if (data.node) {
                                    let nodes = JSON.parse(row.nodes);
                                    for(let node in nodes) {
                                        if (nodes[node].id == data.node.id) {
                                            nodes[node].x = data.node.x;
                                            nodes[node].y = data.node.y;
                                            break;
                                        }
                                    }
                                    db.none('update graphs set nodes = $1 where id = $2', [JSON.stringify(nodes).toString(), data.id]);
                                    socket.broadcast.emit('graphClient', {type: 'pos', node: data.node});
                                    socket.emit('graphClient', {type: 'succes'});
                                } else {
                                    socket.emit('graphClient', {type: 'error', info: 'node not found'});
                                }
                            }
                        });
                    break;
            }
        }
    });
    socket.on('disconnect', function () {

    });
});