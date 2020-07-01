
import { FruchtermanReingoldFD } from './layout.js';
import { DepthFirstSearch } from './DepthFirstSearch.js';
import { BreadthFirstSearch } from './BreadthFirstSearch.js';

export default class AlgorithmBuilder {

    constructor(x, y, w, h, sourceNode) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sourceNode = sourceNode;
    }

    build(algorithm) {
        if (algorithm === 'Fruchterman-Reingold') {
            return new FruchtermanReingoldFD(
                this.x,
                this.y,
                this.w,
                this.h,
                50, 0.001);
        } else if (algorithm === 'Depth-first search') {
            return new DepthFirstSearch(
                this.x,
                this.y,
                this.w,
                this.h,
                this.sourceNode);
        } else if (algorithm === 'Breadth-first search') {
            return new BreadthFirstSearch(
                this.x,
                this.y,
                this.w,
                this.h,
                this.sourceNode);
        } else {
            return null;
        }
    }
}