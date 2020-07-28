import NodeUpdate from './NodeUpdate.js';
import EdgeUpdate from './EdgeUpdate.js';
import PriorityQueue from '../utils/PriorityQueue.js';
import { NodeColor } from '../utils/ColorConstants.js';


export class AStarSearch {
    
    constructor(x, y, width, height, sourceNode, targetNode) {
        /*
            Typical bounding box definition:
            - (x,y) is the top left corner
            - height/width gives the size
            Graph definition:
            - V: number of nodes
            - S: sparsity
            Algorithm parameters:
            - sourceNode: the source node of the search
            - targetNode: the target node of the search
        */
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.sourceNode = sourceNode;
        this.targetNode = targetNode;

        this.step = this.step.bind(this);

        this.crtStep = 0;
        this.maxSteps = Number.MAX_VALUE;

        this.Q = new PriorityQueue((node1, node2) => node1['f'] < node2['f']);
        this.distances = {};
        this.visited = {};
        this.heuristicValues = {};
    }

    isBetter(node1, node2) {
        return node1['f'] ;
    }

    step(nodes, edges) {
        if (this.crtStep === 0) {
            this.heuristicValues = this.estimateDistances(nodes, edges, this.targetNode);

            this.distances[this.sourceNode] = {'f': this.heuristicValues['0'], 'g': 0};
            this.Q.emplace({'key': this.sourceNode, ...this.distances[this.sourceNode]});

            for (var nodeId in nodes) {
                if (nodeId === this.sourceNode) {
                    continue;
                }

                this.distances[nodeId] = {'f': this.heuristicValues[nodeId], 'g': Infinity};
            }
        } else if (this.Q.length() === 0) {
            return null;
        }

        let nodeInfo = this.Q.pop();
        nodeId = nodeInfo['key'];
        this.visited[nodeId] = true;

        if (nodeId === this.targetNode) {
            this.Q.clear();
        }

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

            let candidateScore = Number(this.distances[nodeId]['g'] + edgeWeight);

            if (candidateScore < newDistances[edgeNode2]['g']) {
                newDistances[edgeNode2]['f'] = candidateScore + Number(this.heuristicValues[edgeNode2]);
                newDistances[edgeNode2]['g'] = candidateScore;

                let heapNode = {
                    'key': edgeNode2,
                    'f': newDistances[edgeNode2]['f'],
                    'g': newDistances[edgeNode2]['g']
                };

                if (this.Q.hasKey(edgeNode2)) {
                    this.Q.increasePriority(heapNode);
                } else {
                    this.Q.emplace(heapNode);
                }

                edgeUpdates.push(new EdgeUpdate(
                    edgeId,
                    edgeWeight,
                    true
                ));
            }
        }

        this.distances = newDistances;

        nodeUpdates.push(new NodeUpdate(
            nodeId,
            undefined,
            undefined,
            NodeColor.CLOSED_NODE,
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

    estimateDistances(nodes, edges, sourceNode) {
        let G = this.buildGraph(edges);
        let Q = [];
        let distances = {};

        distances[sourceNode] = 0;
        Q.push(sourceNode);

        while (Q.length > 0) {
            var u = Q.shift();

            for (var i in G[u]) {
                let v = G[u][i];
                if (distances[v] === undefined) {
                    distances[v] = distances[u] + 1;
                    Q.push(v);
                } else {
                    distances[v] = Math.min(distances[v], distances[u] + 1);
                }
            }
        }

        for (u in nodes) {
            if (distances[u] === undefined) {
                distances[u] = Infinity;
            }
        }

        return distances;
    }

    buildGraph(edges) {
        let G = {};

        let addEdge = (u, v) => {
            if (G[u] === undefined) {
                G[u] = [];
            }

            G[u].push(v);
        };

        for (var edgeId in edges) {
            let u = edges[edgeId].getNode1();
            let v = edges[edgeId].getNode2();

            addEdge(u, v);

            if (!edges[edgeId].isDirected()) {
                addEdge(v, u);
            }
        }
        return G;
    }
}
