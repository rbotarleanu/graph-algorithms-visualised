import NodeUpdate from './NodeUpdate.js';


export class DepthFirstSearch {
    
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

        this.visited = {[this.sourceNode]: true};        
        this.stack = [{node: this.sourceNode, status: 'open'}];
    }

    step(nodes, edges) {
        if (this.stack.length === 0) {
            return null;
        }

        var nodeUpdates = [];
        var item = this.stack.pop();
        var currentNode = item['node'];
        var currentNodeStatus = item['status'];

        var nodeUpdate = new NodeUpdate(
            currentNode,
            nodes[currentNode].getX(),
            nodes[currentNode].getY(),
            currentNodeStatus === 'open' ? "yellow" : "green"
        );
        nodeUpdates.push(nodeUpdate);

        if (currentNodeStatus === 'half-open') {
            // skip if we backtrace to a half-open node
            return {
                nodeUpdates: nodeUpdates,
                edgeUpdates: []
            };
        } else {
            // we use this to close nodes after their children have been explored
            this.stack.push({node: currentNode, status: 'half-open'});
        }

        for (var edgeId in edges) {
            var edgeNode1 = edges[edgeId].getNode1();
            var edgeNode2 = edges[edgeId].getNode2();

            if (!edges[edgeId].isDirected()) {
                if (edgeNode1 !== currentNode &&
                    edgeNode2 !== currentNode) {
                        continue;
                } else if (edgeNode2 === currentNode) {
                    edgeNode2 = edgeNode1;
                }
            } else if (edgeNode1 !== currentNode && edges[edgeId].isDirected()) {
                continue;
            }

            if (this.visited[edgeNode2] !== undefined) {
                continue;
            }

            this.stack.push({node: edgeNode2, status: 'open'});
            this.visited[edgeNode2] = true;
        }

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: []
        };
    }
}
