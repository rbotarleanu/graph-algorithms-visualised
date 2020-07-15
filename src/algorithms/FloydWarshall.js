import NodeUpdate from './NodeUpdate.js';
import EdgeUpdate from './EdgeUpdate.js';
import Edge from '../components/Edge.js';


export class FloydWarshall {
    
    constructor(x, y, width, height) {
        /*
            Typical bounding box definition:
            - (x,y) is the top left corner
            - height/width gives the size
            Graph definition:
            - V: number of nodes
            - S: sparsity
        */
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.step = this.step.bind(this);

        this.crtStep = 0;
        this.maxSteps = Number.MAX_VALUE;

        this.distances = {};
        this.backLinks = {};
        this.k = 0;
        this.visited = {};
    }

    step(nodes, edges) {
        if (this.crtStep === 0) {
            for (var nodeId in nodes) {
                this.distances[nodeId] = {};
                this.backLinks[nodeId] = {};
                for (var otherNodeId in nodes) {
                    this.distances[nodeId][otherNodeId] = otherNodeId === nodeId ? 0 : Infinity;
                    this.backLinks[nodeId][otherNodeId] = nodeId;
                }
            }

            for (var edgeId in edges) {
                var node1 = edges[edgeId].getNode1();
                var node2 = edges[edgeId].getNode2();
                var weight = edges[edgeId].getWeight();

                this.distances[node1][node2] = weight;
                this.backLinks[node1][node2] = node1;
                
                if (!edges[edgeId].isDirected()) {
                    this.distances[node2][node1] = weight;
                    this.backLinks[node2][node1] = node2;
                }
            }

            this.maxSteps = Object.keys(nodes).length;
        } else if (this.crtStep === this.maxSteps) {
            return null;
        }
        console.log("crtstep", this.crtStep, this.maxSteps);

        let findEdge = (u, v) => {
            for (var edgeId in edges) {
                if (edges[edgeId].getNode1() === u && edges[edgeId].getNode2() === v) {
                    return edgeId;
                }
                if (!edges[edgeId].isDirected() && edges[edgeId].getNode2() === u && edges[edgeId].getNode1() === v) {
                    return edgeId;
                }
            }
        }

        let findPath = (u, v) => {
            var n = v;
            var path = [];
            while (n !== u) {
                path.unshift(findEdge(u, n));
                n = this.backLinks[u][n];
            }

            return path;
        }

        var nodeUpdates = [];
        var edgeUpdates = [];
        var relaxedEdges = [];

        this.relaxationNode = nodes[this.crtStep].getId();

        var newDistances = {...this.distances};

        for (var u in nodes) {
            for (var v in nodes) {
                let relaxedDist = this.distances[u][this.relaxationNode] + this.distances[this.relaxationNode][v];

                if (this.distances[u][v] > relaxedDist) {
                    newDistances[u][v] = relaxedDist;
                    this.backLinks[u][v] = this.relaxationNode;

                    let ukPath = findPath(u, this.relaxationNode);
                    let kvPath = findPath(this.relaxationNode, v);
                    let ukvPath = ukPath.concat(kvPath);

                    relaxedEdges = relaxedEdges.concat(ukvPath);
                    for (var edgeId in ukvPath) {
                        edgeUpdates.push(new EdgeUpdate(
                            edgeId,
                            undefined,
                            'green'));
                    }
                }
            }
        }

        this.distances = newDistances;

        for (var nodeId in nodes) {
            nodeUpdates.push(new NodeUpdate(
                nodeId,
                undefined,
                undefined,
                'green',
                this.distances[nodeId]));    
        }

        for (var edgeId in edges) {
            // reset highlights for edges not relaxed at this step
            if (relaxedEdges.indexOf(edgeId) === -1) {
                edgeUpdates.push(new EdgeUpdate(
                    edgeId,
                    undefined,
                    'blue'
                ));
            }
        }

        this.crtStep += 1;

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: edgeUpdates
        };
    }
}
