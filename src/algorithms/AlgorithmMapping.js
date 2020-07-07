
import { FruchtermanReingoldFD } from './layout.js';
import { DepthFirstSearch } from './DepthFirstSearch.js';
import { BreadthFirstSearch } from './BreadthFirstSearch.js';
import { BellmanFord } from './BellmanFord.js';

export default class AlgorithmBuilder {

    constructor(x, y, w, h, sourceNode) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sourceNode = sourceNode;
    }

    build(algorithm) {
        switch (algorithm) {
            case 'Fruchterman-Reingold':
                return new FruchtermanReingoldFD(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    50, 0.001);
            case 'Depth-first search':
                return new DepthFirstSearch(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    this.sourceNode);
            case 'Breadth-first search':
                return new BreadthFirstSearch(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    this.sourceNode);
            case 'Bellman-Ford':
                return new BellmanFord(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    this.sourceNode);
            default:
                return null;
        }
    }
}