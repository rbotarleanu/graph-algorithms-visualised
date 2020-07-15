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

        this.distances = {};
        this.backLinks = {};
        this.k = 0;
        this.visited = {};
        this.numNodes = 0;

        this.k = 0;
        this.i = 0;
        this.j = 0;
    }

    step(nodes, edges) {
        if (this.i + this.j + this.k === 0) {
            this.initSearchAlgorithm(nodes, edges);
        } else if (this.k === this.numNodes) {
            return null;
        }

        if (this.i === this.k || this.j === this.k || this.i === this.j) {
            this.increment();
            return this.step(nodes, edges);
        }

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
        var updates = false;

        let relaxationNode = nodes[this.k].getId();
        let u = nodes[this.i].getId();
        let v = nodes[this.j].getId();

        let relaxedDist = this.distances[u][relaxationNode] + this.distances[relaxationNode][v];

        if (this.distances[u][v] > relaxedDist) {
            this.distances[u][v] = relaxedDist;
            this.backLinks[u][v] = relaxationNode;

            let ukPath = findPath(u, relaxationNode);
            let kvPath = findPath(relaxationNode, v);
            let ukvPath = ukPath.concat(kvPath);

            relaxedEdges = relaxedEdges.concat(ukvPath);
            for (var edgeId in ukvPath) {
                edgeUpdates.push(new EdgeUpdate(
                    edgeId,
                    undefined,
                    true));
                
                updates = true;
            }
        }

        for (var nodeId in nodes) {
            var color = 'blue';
            if (nodeId === relaxationNode) {
                color = 'green';
            } else if (nodeId === u || nodeId === v) {
                color = 'yellow';
            }

            nodeUpdates.push(new NodeUpdate(
                nodeId,
                undefined, undefined,
                color,
                this.distances[nodeId]
            ))
        }

        if (this.k > 0 && this.i == 0 && this.j === 1) {
            for (var edgeId in edges) {
                // reset highlights for edges not relaxed at this step
                if (relaxedEdges.indexOf(edgeId) === -1) {
                    edgeUpdates.push(new EdgeUpdate(
                        edgeId,
                        undefined,
                        false
                    ));
                }
            }
        }

        this.increment();

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: edgeUpdates
        };
    }

    increment() {
        this.j += 1;

        if (this.j === this.numNodes) {
            this.j = 0;
            this.i += 1;
        }

        if (this.i === this.numNodes) {
            this.i = 0;
            this.j = 0;
            this.k += 1;
        }
    }

    initSearchAlgorithm(nodes, edges) {
        this.numNodes = Object.keys(nodes).length;

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
    }
}
