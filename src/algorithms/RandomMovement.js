
import NodeUpdate from './NodeUpdate';
import EdgeUpdate from './EdgeUpdate';

export default class RandomMovement {
    constructor(steps) {
        this.steps = steps;
        this.currentStep = 0;
    }

    randomMovement(pos) {
        var sgn = Math.random() < 0.5 ? -1 : 1;
        var delta = Math.random() * 10;
        return pos + delta * sgn;
    }

    step(nodes, edges) {
        if (this.currentStep === this.steps) {
            return null;
        }
        this.currentStep += 1;
        var nodeUpdates = [];
        var edgeUpdates = [];

        for (var nodeId in nodes) {
            var posX = nodes[nodeId].state.posX;
            var posY = nodes[nodeId].state.posY;

            var newX = this.randomMovement(posX);
            var newY = this.randomMovement(posY);
            var nodeUpdate = new NodeUpdate(nodeId, newX, newY);
            nodeUpdates.push(nodeUpdate);
        }

        return {
            nodeUpdates: nodeUpdates,
            edgeUpdates: edgeUpdates
        };
    }
}