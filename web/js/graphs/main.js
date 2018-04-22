
let events = {
    twoPointsHelper: [],
    mode: {
        addNode: false,
        addEdge: false,
        shortestPath: false
    },
    callbackOnline: function(type, data) {},
    module: null,
    init: function(module) {
        this.module = module;
    },
    clickEvent: function(e) {
        this.module.refresh();
        if (this.mode.addNode) {
            this.addNodeEvent(e);
            return true;
        } else if (this.mode.addEdge) {
            this.addEdgeEvent(e);
            return true;
        } else if (this.mode.shortestPath) {
            this.shortestPath(e);
            return true;
        }
        return false;
    },
    shortestPath: function(e) {
        let self = this;
        if (e.type != null && e.type == 'clickNode') {
            if (this.twoPointsHelper.length < 2) {
                this.twoPointsHelper.push(e.data.node);
                $.each(this.module.graph.nodes(), function(node) {
                    if (self.module.graph.nodes()[node].id == e.data.node.id) {
                        self.module.graph.nodes()[node].color = '#CCCC66';
                        self.module.refresh();
                    }
                });
            }
        } else {
            if (this.twoPointsHelper.length == 2) {
                let path = this.module.graph.astar(this.twoPointsHelper[0].id, this.twoPointsHelper[1].id, {
                    pathLengthFunction: checkWeight
                });
                console.log(path, this.twoPointsHelper[0].id, this.twoPointsHelper[1].id);
                if (path) {
                    this.refreshEdges();
                    for(let i = 0; i < path.length; i++) {
                        path[i].color = '#CCCC66';
                        if(i > 0) {
                            let edge = this.module.graph.edges(getEdgeId(path[i - 1].id, path[i].id));
                            if(edge) {
                                edge.color = '#CCCC66';
                            }
                        }
                    }
                }
                this.mode.shortestPath = false;
                this.twoPointsHelper = [];
                this.module.refresh();
            }
        }
    },
    addNodeEvent: function(e) {
        let name = prompt('Введите уникальное название вершины');
        if (typeof name === 'undefined' || name == null)
            return false;
        let x = sigma.utils.getX(e) - e.target.width / 2;
        let y = sigma.utils.getY(e) - e.target.height / 2;
        let p = this.module.camera.cameraPosition(x, y);
        x = p.x;
        y = p.y;
        let node = {
            id: 'n' + name,
            label: name,
            x: x,
            y: y,
            size: 5
        };
        this.module.graph.addNode(node);
        this.callbackOnline('node', node);
        this.module.refresh();
        this.mode.addNode = false;
    },
    addEdgeEvent: function(e) {
        let self = this;
        if (e.type != null && e.type == 'clickNode') {
            if (this.twoPointsHelper.length < 2) {
                this.twoPointsHelper.push(e.data.node);
                $.each(this.module.graph.nodes(), function(node) {
                    if (self.module.graph.nodes()[node].id == e.data.node.id) {
                        self.module.graph.nodes()[node].color = '#4c3a91';
                        self.module.refresh();
                        self.refreshEdges();
                    }
                });
            }
        } else {
            if (this.twoPointsHelper.length == 2) {
                let weight = prompt('Введите массу ребра');
                if (typeof weight === 'undefined' || weight == null)
                    return false;
                let edge = {
                    id: this.twoPointsHelper[0].id + '.' + this.twoPointsHelper[1].id,
                    label: weight,
                    source: this.twoPointsHelper[0].id,
                    target: this.twoPointsHelper[1].id
                };
                this.module.graph.addEdge(edge);
                this.callbackOnline('edge', edge);
                this.mode.addEdge = false;
                this.twoPointsHelper = [];
                this.refreshNodes();
                this.module.refresh();
            }
        }
    },
    refresh: function() {
        this.refreshNodes();
        this.refreshEdges();
    },
    refreshNodes: function() {
        this.module.graph.nodes().forEach(function(item) {
            item.color = '#000000';
        });
    },
    refreshEdges: function() {
        this.module.graph.edges().forEach(function(item) {
            item.color = '#000000';
        });
    }
};

let sigmaModule = window.sigmaModule =  {
    idGraph: 0,
    module: {},
    data: null,
    dragListener: null,
    init: function(s, id) {
        this.module = s;
        this.idGraph = id;
        this.module.graph.addNode({
            id:     'ghost',
            size:   0,
            x:      0,
            y:      0,
            dX:     0,
            dY:     0,
            type:   'ghost'
        });
        this.module.camera.goTo({
            x: 1000,
            y: 1000
        });
        this.loadData(this.render);
        this.events.init(this.module);
    },
    addNodes: function(data, module) {
        if (data == null || data.length == 0) return;
        for(let t in data) {
            module.graph.addNode(data[t]);
        }
    },
    addEdges: function(data, module) {
        if (data == null || data.length == 0) return;
        for(let t in data) {
            module.graph.addEdge(data[t]);
        }
    },
    events: events,
    render: function(data, self) {
        self.addNodes(data.nodes, self.module);
        self.addEdges(data.edges, self.module);
        self.module.graph.nodes().forEach(function(node) {
            node.hidden = false;
        });
        self.module.refresh();
    },
    loadData: function(c) {
        let self = this;
        $.post('data', {
            type: 'get',
            id: this.idGraph
        }, function(data) {
            self.data = JSON.parse(data);
            if (typeof c === 'function') {
                c(self.data, self);
            }
        })
    },
    saveData: function() {
        this.events.refresh();
        let nodes = this.module.graph.nodes();
        let edges = this.module.graph.edges();
        let neededNodes = ['x', 'y', 'size', 'label', 'id'];
        let neededEdges = ['label', 'id', 'source', 'target'];
        for(let item in nodes) {
            Object.keys(nodes[item]).forEach(function(itm){
                if(neededNodes.indexOf(itm) == -1) delete nodes[item][itm];
            });
            if (nodes[item].id == 'ghost') {
                delete nodes[item];
                nodes.splice(item, 1);
            }
        }
        for(let item in edges) {
            Object.keys(edges[item]).forEach(function(itm){
                if(neededEdges.indexOf(itm) == -1) delete edges[item][itm];
            });
        }
        $.post('data', {
            type: 'save',
            id: this.idGraph,
            nodes: nodes,
            edges: edges,
        }, function(data) {
            if (data === 'OK')
                alert('Сохранено');
        })
    },
    setMode: function(m) {
        if (!this.events.mode.hasOwnProperty(m))
            return false;
        for(let i in this.events.mode) {
            this.events.mode[i] = false;
        }
        this.events.mode[m] = true;
        return true;
    }
};

$(document).ready(function() {
    let s = new sigma({
        renderer: {
            container: "graph",
            type: "canvas"
        },
        settings: {
            autoRescale: false,
            defaultEdgeType: 'arrow',
            defaultEdgeArrow: 'target',
            minArrowSize: 5
        }

    });

    sigmaModule.dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
    sigmaModule.init(s, graphId);

    let $dom = $('#graph canvas:last-child');

    // Событие: Клик по холсту
    $dom.click(function(e) {
        sigmaModule.events.clickEvent(e);
    });
    //Добавление вершин
    $('.item.add-node').click(function() {
        console.log('Mode addNode: ' + sigmaModule.setMode('addNode'));
    });

    //Добавление ребер
    $('.item.join-node').click(function() {
        console.log('Mode addEdge: ' + sigmaModule.setMode('addEdge'));
    });

    //Поиск кратчайшего пути
    $('.item.find-path').click(function() {
        console.log('Mode shortestPath: ' + sigmaModule.setMode('shortestPath'));
        sigmaModule.events.refresh();
    });

    //Событие: клик по вершине
    s.bind('clickNode', function(e) {
        sigmaModule.events.clickEvent(e);
    });

    $('.menu .save').click(function() {
        sigmaModule.saveData();
    });

});

let getEdgeId = function(i, j) {
    return i + '.' + j;
};
//  Хелпер для поиска кратчайшего пути (при поиске учитывать вес)
function checkWeight(node1, node2, previousPathLength) {

    let isEverythingDefined =
        node1 != undefined &&
        node2 != undefined &&
        node1.id != undefined &&
        node2.id != undefined,
        weight = 0;
    if(!isEverythingDefined) {
        return undefined;
    }
    sigmaModule.module.graph.edges().forEach(function(item) {
        if (item.id == getEdgeId(node1.id, node2.id) || item.id == getEdgeId(node2.id, node1.id)) {
            weight = parseInt(item.label);
        }
    });
    return (previousPathLength || 0) + weight;
}