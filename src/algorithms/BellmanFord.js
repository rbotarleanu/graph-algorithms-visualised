import NodeUpdate from './NodeUpdate.js';
import EdgeUpdate from './EdgeUpdate.js';


export class BellmanFord {
    
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
    }

    step(nodes, edges) {
        if (this.crtStep === 0) {
            this.distances = {};
            this.maxSteps = Math.min(this.maxSteps, Object.keys(nodes).length - 1);
            for (var nodeId in nodes) {
                if (nodeId === this.sourceNode) {
                    this.distances[nodeId] = 0;
                } else {
                    this.distances[nodeId] = Infinity;
                }
            }

        } else if (this.crtStep === this.maxSteps) {
            return null;
        }
        
        this.crtStep += 1;

        var nodeUpdates = [];
        var edgeUpdates = [];

        var newDistances = {...this.distances};

        for (var edgeId in edges) {
            var edgeNode1 = edges[edgeId].getNode1();
            var edgeNode2 = edges[edgeId].getNode2();
            var edgeWeight = edges[edgeId].getWeight();

            // Edge relaxation
            if (this.distances[edgeNode2] > this.distances[edgeNode1] + edgeWeight) {
                newDistances[edgeNode2] = this.distances[edgeNode1] + edgeWeight;
                edgeUpdates.push(new EdgeUpdate(
                    edgeId,
                    edgeWeight,
                    true
                ));
            }

            if (!edges[edgeId].isDirected()) {
                if (this.distances[edgeNode1] > this.distances[edgeNode2] + edgeWeight) {
                    newDistances[edgeNode1] = this.distances[edgeNode2] + edgeWeight;
                    edgeUpdates.push(new EdgeUpdate(
                        edgeId,
                        edgeWeight,
                        true
                    ));
                }
            }
        }

        this.distances = {...newDistances};

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
