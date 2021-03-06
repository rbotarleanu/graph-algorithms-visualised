import NodeUpdate from './NodeUpdate.js';
import { NodeColor } from '../utils/ColorConstants.js';


export class BreadthFirstSearch {
    
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
        var item = this.stack.shift();
        var currentNode = item['node'];
        var currentNodeStatus = item['status'];

        // skip if we backtrace to a half-open node
        var nodeUpdate = new NodeUpdate(
            currentNode,
            nodes[currentNode].getX(),
            nodes[currentNode].getY(),
            currentNodeStatus === 'open' ? NodeColor.OPEN_NODE : NodeColor.CLOSED_NODE
        );
        nodeUpdates.push(nodeUpdate);

        if (currentNodeStatus === 'half-open') {
            return {
                nodeUpdates: nodeUpdates,
                edgeUpdates: []
            };
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
            nodeUpdate = new NodeUpdate(
                edgeNode2,
                nodes[edgeNode2].getX(),
                nodes[edgeNode2].getY(),
                NodeColor.OPEN_NODE
            );
            nodeUpdates.push(nodeUpdate);
        }

        // we use this to close nodes after their children have been explored
        this.stack.push({node: currentNode, status: 'half-open'});

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: []
        };
    }
}
