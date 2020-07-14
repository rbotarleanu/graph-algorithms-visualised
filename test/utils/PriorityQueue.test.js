
const PriorityQueue = require('../../src/utils/PriorityQueue');

test("Length returns number of elements emplaced", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    expect(pq.length()).toBe(0);

    pq.emplace({'key': 'a', 'value': 2});
    expect(pq.length()).toBe(1);

    pq.emplace({'key': 'b', 'value': 0});
    expect(pq.length()).toBe(2);

    pq.emplace({'key': 'c', 'value': 1});
    expect(pq.length()).toBe(3);
});

test("Push correctly sets heap root", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    pq.emplace({'key': 'a', 'value': 2});
    expect(pq.peek()['key']).toBe('a');
    pq.emplace({'key': 'b', 'value': 0});
    expect(pq.peek()['key']).toBe('b');
    pq.emplace({'key': 'c', 'value': 1});
    expect(pq.peek()['key']).toBe('b');
});


test("Pop returns smallest value", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    pq.emplace({'key': 'a', 'value': 2});
    pq.emplace({'key': 'b', 'value': 0});
    pq.emplace({'key': 'c', 'value': 1});

    expect(pq.length() === 3);

    expect(pq.peek()['key']).toBe('b');
    expect(pq.pop()['key']).toBe('b');
    expect(pq.peek()['key']).toBe('c');
    expect(pq.pop()['key']).toBe('c');
    expect(pq.peek()['key']).toBe('a');
    expect(pq.pop()['key']).toBe('a');
});

test("Pop returns largest value", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] > b['value']));
    pq.emplace({'key': 'a', 'value': 2});
    pq.emplace({'key': 'b', 'value': 0});
    pq.emplace({'key': 'c', 'value': 1});

    expect(pq.length() === 3);

    expect(pq.peek()['key']).toBe('a');
    expect(pq.pop()['key']).toBe('a');
    expect(pq.peek()['key']).toBe('c');
    expect(pq.pop()['key']).toBe('c');
    expect(pq.peek()['key']).toBe('b');
    expect(pq.pop()['key']).toBe('b');
});

test("Increase priority lowest priority node", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    pq.emplace({'key': 'a', 'value': 2});
    pq.emplace({'key': 'b', 'value': 0});
    pq.emplace({'key': 'c', 'value': 1});

    pq.increasePriority({'key': 'a', 'value': 5});

    expect(pq.pop()['key']).toBe('b');
    expect(pq.pop()['key']).toBe('c');
    expect(pq.peek()['key']).toBe('a');
    expect(pq.pop()['value']).toBe(5);

});

test("Increase priority highest priority node", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    pq.emplace({'key': 'a', 'value': 2});
    pq.emplace({'key': 'b', 'value': 0});
    pq.emplace({'key': 'c', 'value': 1});

    pq.increasePriority({'key': 'b', 'value': -1});

    expect(pq.peek()['value']).toBe(-1);
    expect(pq.pop()['key']).toBe('b');
    expect(pq.pop()['key']).toBe('c');
    expect(pq.pop()['key']).toBe('a');
});

test("Increase priority middle priority node", () => {
    var pq = new PriorityQueue((a, b) => (a['value'] < b['value']));
    pq.emplace({'key': 'a', 'value': 3});
    pq.emplace({'key': 'b', 'value': 0});
    pq.emplace({'key': 'c', 'value': 1});
    pq.emplace({'key': 'd', 'value': 2});

    pq.increasePriority({'key': 'd', 'value': -1});

    expect(pq.peek()['value']).toBe(-1);
    expect(pq.pop()['key']).toBe('d');
    expect(pq.pop()['key']).toBe('b');
    expect(pq.pop()['key']).toBe('c');
    expect(pq.pop()['key']).toBe('a');
});