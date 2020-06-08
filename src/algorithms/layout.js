
import NodeUpdate from './NodeUpdate.js';


class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(other) {
        return new Vector2D(other.x - this.x, other.y - this.y);
    }

    add(other) {
        return new Vector2D(
            this.x += other.x,
            this.y += other.y
        );
    }

    reverse() {
        return new Vector2D(-this.x, -this.y);
    }

    l2norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    normalize() {
        const norm = this.l2norm();

        if (norm === 0) {
            return new Vector2D(0, 0);
        }

        return new Vector2D(this.x / norm, this.y / norm);
    }

    scalarMul(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
}

class Edge {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }

}

export class RandomLayout {

    constructor(x, y, width, height, numNodes, sparsity) {
        /*
            Typical bounding box definition:
            - (x,y) is the top left corner
            - height/width gives the size
            Graph definition:
            - V: number of nodes
            - S: sparsity
            Algorithm parameters:
            - iterations: number of iterations the algorithm runs 
        */
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.area = this.height * this.width;
        this.numNodes = numNodes;
        this.sparsity = sparsity;
        this.crtStep = 0;

        this.nodes = this.makeRandomNodePositions();
        this.edges = this.makeRandomEdges();
    }

    makeRandomPosition() {
        var x = this.x + Math.random() * this.height;
        var y = this.y + Math.random() * this.width;
        return new Vector2D(y, x);
    }

    makeRandomNodePositions() {
        var nodes = [];

        for (var i = 0; i < this.numNodes; ++i) {
            nodes.push(this.makeRandomPosition());
        }

        return nodes;
    }

    makeRandomEdges() {
        var edges = [];

        for (var i = 0; i < this.numNodes; ++i) {
            for (var j = 0; j < this.numNodes; ++j) {
                if (i !== j && Math.random() < this.sparsity) {
                    edges.push(new Edge(i, j));
                }
            }
        }

        return edges;
    }

    step() {
        if (this.crtStep !== 0) {
            return null;
        }
        this.crtStep += 1;

        return {nodes: this.nodes, edges: this.edges};
    }
}

export class FruchtermanReingoldFD {
    
    constructor(x, y, width, height, iterations, scale) {
        /*
            Typical bounding box definition:
            - (x,y) is the top left corner
            - height/width gives the size
            Graph definition:
            - V: number of nodes
            - S: sparsity
            Algorithm parameters:
            - iterations: number of iterations the algorithm runs 
            - scale: scale of optimal distance
        */
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.area = this.height * this.width;
        this.iterations = iterations;
        this.scale = scale;

        this.repulsion = this.repulsion.bind(this);
        this.attraction = this.attraction.bind(this);

        this.initialTemp = this.width / 10;
        this.maxDistance = new Vector2D(this.x, this.y).distance(
            this.x + this.height, this.y + this.width);

        this.step = this.step.bind(this);
        this.temp = this.initialTemp;
    
        this.crtStep = 0;
    }

    optimalDistance(numNodes) {
        return this.scale * Math.sqrt(this.area / numNodes);
    }

    attraction(v1, v2, numNodes) {
        var d = v1.distance(v2);
        var a = Math.pow(d.l2norm(), 2) / this.optimalDistance(numNodes);

        return d.normalize().scalarMul(a * this.scale);
    }

    repulsion(v1, v2, numNodes) {
        var d = v1.distance(v2);
        var r = -Math.pow(this.optimalDistance(numNodes), 2) / d.l2norm();

        return d.normalize().scalarMul(r / this.scale);
    }

    addRepulsionForces(nodeForces, nodes) {
        for (var u = 0; u < nodes.length; ++u) {
            for (var v = u + 1; v < nodes.length; ++v) {
                if (nodeForces[u] === undefined) {
                    nodeForces[u] = new Vector2D(0, 0);
                }
                if (nodeForces[v] === undefined) {
                    nodeForces[v] = new Vector2D(0, 0);
                }

                var repulsionVector = this.repulsion(
                    nodes[u], nodes[v], nodes.length);
                nodeForces[u] = nodeForces[u].add(repulsionVector);
                nodeForces[v] = nodeForces[v].add(repulsionVector.reverse());
            }
        }
    }

    addAttractionForces(nodeForces, nodes, edges) {
        for (var e = 0; e < edges.length; ++e) {
            var u = edges[e].u;
            var v = edges[e].v;

            var attractionVector = this.attraction(
                nodes[u], nodes[v], nodes.length);
            nodeForces[u] = nodeForces[u].add(attractionVector);
            nodeForces[v] = nodeForces[v].add(attractionVector.reverse());
        }
    }

    computeNewPositions(nodeForces, nodes) {
        for (var v = 0; v < nodes.length; ++v) {
            var dx = Math.sign(nodeForces[v].x) * Math.min(
                Math.abs(nodeForces[v].x), this.temp);
            var dy = Math.sign(nodeForces[v].y) * Math.min(
                Math.abs(nodeForces[v].y), this.temp);
            nodes[v].x = nodes[v].x + dx;
            nodes[v].y = nodes[v].y + dy;

            // positions should be bound in graph area
            nodes[v].x = Math.max(
                this.x, Math.min(this.width - this.x, nodes[v].x));
            nodes[v].y = Math.max(
                this.y, Math.min(this.height - this.y, nodes[v].y));
        }
    }

    cool() {
        this.temp -= this.initialTemp / (this.iterations + 1);
    }

    step(nodes, edges) {
        if (this.crtStep === this.iterations) {
            return null;
        }
        this.crtStep += 1;

        var nodePositions = [];
        var edgeList = [];
        var nodeIds = [];

        for (var nodeIdx in nodes) {
            var nodeId = nodes[nodeIdx].getId();
            var nodeX = nodes[nodeIdx].getX();
            var nodeY = nodes[nodeIdx].getY();

            nodeIds.push(nodePositions.length);
            var nodePosition = new Vector2D(nodeX, nodeY);
            nodePositions.push(nodePosition);
        }

        for (var edgeId in edges) {
            var edgeNode1 = edges[edgeId].getNode1();
            var edgeNode2 = edges[edgeId].getNode2();

            edgeList.push(new Edge(edgeNode1, edgeNode2));
        }

        var nodeForces = {};
        this.addRepulsionForces(nodeForces, nodePositions);
        this.addAttractionForces(nodeForces, nodePositions, edgeList);
        this.computeNewPositions(nodeForces, nodePositions);
        this.cool();
        var nodeUpdates = [];
        var edgeUpdates = [];

        for (var i = 0; i < nodePositions.length; ++i) {
            nodeId = nodeIds[i];
            var nodeUpdate = new NodeUpdate(
                nodeId,
                nodePositions[i].x,
                nodePositions[i].y
            );
            nodeUpdates.push(nodeUpdate);
        }

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: edgeUpdates
        };
    }
}
