
import { FruchtermanReingoldFD } from './layout.js';

export default class AlgorithmBuilder {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    build(algorithm, x, y, w, h) {
        if (algorithm === 'Fruchterman-Reingold') {
            return new FruchtermanReingoldFD(
                this.x,
                this.y,
                this.w,
                this.h,
                50, 0.001);
        } else {
            return null;
        }
    }
}