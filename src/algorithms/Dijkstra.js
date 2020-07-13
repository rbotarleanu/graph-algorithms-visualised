import NodeUpdate from './NodeUpdate.js';
import EdgeUpdate from './EdgeUpdate.js';
import PriorityQueue from '../utils/PriorityQueue.js';


export class Dijkstra {
    
    constructor(x, y, width, height, sourceNode) {
        /*
            Typical bounding box definition:
            - (x,y) is the top left corner
            - height/width gives the size
            Graph definition:
            - V: number of nodes
            - S: sparsity
            Algorithm parameters:
            - sourceNode: the source node of the search
        */
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.sourceNode = sourceNode;

        this.step = this.step.bind(this);

        this.crtStep = 0;
        this.maxSteps = Number.MAX_VALUE;

        this.Q = new PriorityQueue(
            (node1, node2) => node1['value'] < node2['value']
        );
        this.distances = {};
        this.visited = {};
    }

    step(nodes, edges) {
        if (this.crtStep === 0) {
            this.Q.emplace({'key': this.sourceNode, 'value': 0});

            for (var nodeId in nodes) {
                this.distances[nodeId] = Infinity;
            }
            this.distances[this.sourceNode] = 0;

        } else if (this.Q.length() == 0) {
            return null;
        }

        let nodeInfo = this.Q.pop();
        var nodeId = nodeInfo['key'];
        this.visited[nodeId] = true;

        this.crtStep += 1;

        var nodeUpdates = [];
        var edgeUpdates = [];

        var newDistances = {...this.distances};

        for (var edgeId in edges) {
            var edgeNode1 = edges[edgeId].getNode1();
            var edgeNode2 = edges[edgeId].getNode2();
            var edgeWeight = edges[edgeId].getWeight();
            var directed = edges[edgeId].isDirected();

            if ((edgeNode1 !== nodeId) && (!directed && edgeNode2 !== nodeId)) {
                continue;
            }

            if (edgeNode2 === nodeId) {
                edgeNode2 = edgeNode1;
            }

            if (newDistances[edgeNode2] > this.distances[nodeId] + edgeWeight) {
                newDistances[edgeNode2] = this.distances[nodeId] + edgeWeight;
                edgeUpdates.push(new EdgeUpdate(
                    edgeId,
                    edgeWeight,
                    true
                ));
            }
        }


        for (var nodeId in this.distances) {
            if (this.visited[nodeId] !== undefined || newDistances[nodeId] == this.distances[nodeId]) {
                continue;
            }
            this.Q.emplace({"key": nodeId, "value": this.distances[nodeId]});
        }

        this.distances = newDistances;

        nodeUpdates.push(new NodeUpdate(
            nodeId,
            undefined,
            undefined,
            'green',
            undefined));

        nodeUpdates.push(new NodeUpdate(
            this.sourceNode,
            undefined,
            undefined,
            undefined,
            this.distances
        ));

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: edgeUpdates
        };
    }
}
