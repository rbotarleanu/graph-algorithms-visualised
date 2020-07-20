
import { FruchtermanReingoldFD } from './layout.js';
import { DepthFirstSearch } from './DepthFirstSearch.js';
import { BreadthFirstSearch } from './BreadthFirstSearch.js';
import { BellmanFord } from './BellmanFord.js';
import { Dijkstra } from './Dijkstra.js';
import { FloydWarshall } from './FloydWarshall.js';
import { AStarSearch } from './AStarSearch.js';

export default class AlgorithmBuilder {

    constructor(x, y, w, h, sourceNode, targetNode) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
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
            case 'Dijkstra':
                return new Dijkstra(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    this.sourceNode);
            case 'Floyd-Warshall':
                return new FloydWarshall(
                    this.x,
                    this.y,
                    this.w,
                    this.h)
            case 'A*':
                return new AStarSearch(
                    this.x,
                    this.y,
                    this.w,
                    this.h,
                    this.sourceNode,
                    this.targetNode);
            default:
                return null;
        }
    }
}