$(document).ready(function() {
    let socket = io.connect('http://' + window.location.host + ':8803/');

    socket.on('graphClient', function(data) {
        if (data.type && (data.node || data.edge)) {
            switch(data.type) {
                case 'pos':
                    sigmaModule.module.graph.nodes().forEach(function (item) {
                        if (item.id == data.node.id) {
                            item.x = data.node.x;
                            item.y = data.node.y;
                        }
                    });
                    sigmaModule.module.refresh();
                    break;
                case 'node':
                    sigmaModule.module.graph.addNode(data.node);
                    sigmaModule.module.refresh();
                    break;
                case 'edge':
                    sigmaModule.module.graph.addEdge(data.edge);
                    sigmaModule.module.refresh();
                    break;
            }
        }
    });
    sigmaModule.events.callbackOnline = function(type, data) {
        switch(type) {
            case 'node':
                socket.emit('graphServer', {
                    id: graphId,
                    type: type,
                    node: clearNode(data)
                });
                break;
            case 'edge':
                socket.emit('graphServer', {
                    id: graphId,
                    type: type,
                    edge: clearEdge(data)
                });
                break;
        }
    };
    sigmaModule.dragListener.bind('drop drag' ,function(event) {
        let node = clearNode(Object.assign({}, event.data.node));
        socket.emit('graphServer', {
            type: 'pos',
            id: graphId,
            node: node
        });
    })
});

function clearNode(node) {
    let neededNodeParams = ['x', 'y', 'size', 'label', 'id'];
    Object.keys(node).forEach(function(item){
        if(neededNodeParams.indexOf(item) == -1) delete node[item];
    });
    return node;
}
function clearEdge(edge) {
    let neededEdgeParams = ['label', 'id', 'source', 'target'];
    Object.keys(edge).forEach(function(item){
        if(neededEdgeParams.indexOf(item) == -1) delete edge[item];
    });
    return edge;
}