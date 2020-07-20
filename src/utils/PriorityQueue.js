
class PriorityQueue {
    constructor(hasPriority) {
        this.hasPriority = hasPriority;
        this.heap = [];
        this.index = {};
    }

    initialize(values) {
        for (var val in values) {
            this.emplace(val);
        }
    }

    parent(idx) {
        return Math.floor((idx + 1) / 2 - 1);
    }

    leftChild(idx) {
        return idx * 2 + 1;
    }

    rightChild(idx) {
        return idx * 2 + 2;
    }

    peek() {
        return this.heap[0];
    }

    pop() {
        let top = this.peek();
        this.heap.shift();
        this.index[top['key']] = undefined;

        this.siftDown(0);

        return top;
    }
 
    swap(idx1, idx2) {
        let aux = this.heap[idx1];

        this.index[this.heap[idx1]['key']] = idx2;
        this.index[this.heap[idx2]['key']] = idx1;

        this.heap[idx1] = this.heap[idx2];
        this.heap[idx2] = aux;
    }

    hasKey(key) {
        return this.index[key] !== undefined;
    }

    clear() {
        this.heap = [];
        this.index = {};
    }

    length() {
        return this.heap.length;
    }

    siftUp(idx) {
        // Moves the element at idx in the vectorized heap into position by
        // traversing upwards through the hierarchy
        while (idx > 0 && this.hasPriority(this.heap[idx], this.heap[this.parent(idx)])) {
            this.swap(idx, this.parent(idx));
            idx = this.parent(idx);
        }
    }

    siftDown(idx) {
        // Moves the element at idx in the vectorized heap into position by
        // traversing downwards through the hierarchy

        while (idx < this.heap.length) {
            let leftIdx = this.leftChild(idx);
            let rightIdx = this.leftChild(idx);
            var swapPosition = idx;
            
            if (leftIdx < this.heap.length && this.hasPriority(this.heap[leftIdx], this.heap[swapPosition])) {
                swapPosition = leftIdx;
            }

            if (rightIdx < this.heap.length && this.hasPriority(this.heap[rightIdx], this.heap[swapPosition])) {
                swapPosition = rightIdx;
            }

            // both children have lower priority than their parent - hierarchy is valid
            if (swapPosition === idx) {
                break;
            }

            this.swap(idx, swapPosition);
            idx = swapPosition;
        }
    }

    emplace(val) {
        // Adds a value by pushing it into the vectorized heap and moving it upwards in
        // the hierarchy.
        this.heap.push(val);
        this.index[val['key']] = this.heap.length - 1;
        this.siftUp(this.heap.length - 1);
    }

    increasePriority(node) {
        // Increases the priority of a node
        let idx = this.index[node['key']];
        this.heap[idx] = node;
        this.siftUp(idx);
    }
}

module.exports = PriorityQueue;