import React, { Component } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import '../styles/Graph.css';

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.radius = props.nodeRadius;

        this.state = {nodes: {}, edges: {},
                      nodeIncidentEdges: {},
                      sourceNode: props.sourceNode,
                      directed: props.directed};
        this.setGraphElements(this.state, props.nodes, props.edges);
        this.edgeRefs = {};
        this.nodeRefs = {};

        this.nodeChangeAttributes = this.nodeChangeAttributes.bind(this);
        this.edgeChangeAttributes = this.edgeChangeAttributes.bind(this);
        this.remake = this.remake.bind(this);
        this.updateDirection = this.updateDirection.bind(this);
    }

    setGraphElements(state, nodes, edges) {
        for (var i = 0; i < nodes.length; ++i) {
            var nodeId = i.toString();
            state.nodes[nodeId] = {
                "id": nodeId,
                "posX": nodes[i].x,
                "posY": nodes[i].y,
                radius: this.radius,
                fill: this.state.sourceNode !== nodeId ? "red" : "blue",
                distances: undefined
            };
        }
        for (i = 0; i < edges.length; ++i) {
            var edgeId = i.toString();
            var node1 = edges[i].u.toString();
            var node2 = edges[i].v.toString();
            var edgeWeight = edges[i].w;
            state.edges[edgeId] = {
                "node1":  node1,
                "node2":  node2,
                width: 1,
                weight: edgeWeight,
                highlight: false
            };
        }
    }

    remake(graph) {
        var newState = this.state;
        const nodes = graph.nodes;
        const edges = graph.edges;

        newState.nodes = {};
        newState.edges = {};
        newState.nodeIncidentEdges = {};
        newState.nodeRefs = {};
        newState.edgeRefs = {};

        this.setGraphElements(newState, nodes, edges);
        this.setState(newState);
        requestAnimationFrame(() => {
            var filteredNodeRefs = {};
            for (var nodeRef in this.nodeRefs) {
                if (this.nodeRefs[nodeRef] === null) {
                    continue;
                }
                this.nodeRefs[nodeRef].fill = nodeRef === this.state.sourceNode ? 'blue' : 'red';
                filteredNodeRefs[nodeRef] = this.nodeRefs[nodeRef];
            }
            this.nodeRefs = filteredNodeRefs;

            var filteredEdgeRefs = {};
            for (var edgeRef in this.edgeRefs) {
                if (this.edgeRefs[edgeRef] === null) {
                    continue;
                }
                filteredEdgeRefs[edgeRef] = this.edgeRefs[edgeRef];
            }
            this.edgeRefs = filteredEdgeRefs;
        }, 0);
    }

    nodeChangeAttributes(nodeId, nodePosX, nodePosY, fill, distances) {
        var stateNodes = this.state.nodes;

        if (fill !== undefined) {
            stateNodes[nodeId].fill = fill;
        }

        if (nodePosX !== undefined && nodePosY !== undefined) {
            stateNodes[nodeId].posX = nodePosX;
            stateNodes[nodeId].posY = nodePosY;
            for (var edgeId in this.state.edges) {
                var edge = this.state.edges[edgeId];
                if (edge.node1 !== nodeId && edge.node2 !== nodeId) {
                    continue;
                }
                this.edgeRefs[edgeId].handleNodePositionChange(
                    nodeId === edge.node1 ? 0: 1,
                    nodePosX,
                    nodePosY
                );
            }
        }

        if (distances !== undefined) {
            stateNodes[nodeId].distances = distances;
        }

        this.setState({nodes: stateNodes});
    }

    edgeChangeAttributes(edgeId, edgeWeight, edgeHighlight) {
        var edges = this.state.edges;
        edges[edgeId].weight = edgeWeight;
        edges[edgeId].highlight = edgeHighlight;
        
        this.setState({edges: edges});
    }

    updateGraphState(nodeUpdates, edgeUpdates) {
        nodeUpdates.map(nodeUpdate => {
            this.nodeChangeAttributes(
                nodeUpdate.nodeId,
                nodeUpdate.x,
                nodeUpdate.y,
                nodeUpdate.color,
                nodeUpdate.distances);

            return null;
        });

        edgeUpdates.map(edgeUpdate => {
            this.edgeChangeAttributes(
                edgeUpdate.edgeId,
                edgeUpdate.weight,
                edgeUpdate.highlight
            )

            return null;
        });
    }

    resetGraphAlgorithmVisuals() {
        console.log("resetting");
        for (var nodeId in this.state.nodes) {
            let fill = nodeId === this.state.sourceNode ? 'blue' : 'red';
            this.nodeChangeAttributes(nodeId, undefined, undefined, fill, {});
        }

        for (var edgeId in this.state.edges) {
            let highlight = false;
            this.edgeChangeAttributes(edgeId, undefined, highlight);
        }
    }

    updateDirection(newDirection) {
        this.setState({directed: newDirection});
    }

    updateWeightedStatus(newWeighted) { 
        this.setState({weighted: newWeighted});
    }

    getNodes() {
        return this.state.nodes;
    }

    getEdges() {
        return this.state.edges;
    }

    getNodeRefs() {
        return this.nodeRefs;
    }

    getEdgeRefs() {
        return this.edgeRefs;
    }

    render() {
        return (
            <div className="Graph">
                <svg>
                    {
                        Object.keys(this.state.edges).map((edgeId, _) => {
                            return (
                                <Edge
                                    key={edgeId}
                                    edgeId={edgeId}
                                    width={this.state.edges[edgeId].width}
                                    x1={this.state.nodes[this.state.edges[edgeId].node1].posX}
                                    y1={this.state.nodes[this.state.edges[edgeId].node1].posY}
                                    x2={this.state.nodes[this.state.edges[edgeId].node2].posX}
                                    y2={this.state.nodes[this.state.edges[edgeId].node2].posY}
                                    nodeRadius={this.state.nodes[this.state.edges[edgeId].node2].radius}
                                    node1={this.state.edges[edgeId].node1}
                                    node2={this.state.edges[edgeId].node2}
                                    ref={(ref) => this.edgeRefs[edgeId]=ref}
                                    directed={this.state.directed}
                                    highlight={this.state.edges[edgeId].highlight}
                                    weight={this.state.weighted ? this.state.edges[edgeId].weight : ""}
                                />
                            )
                        })
                    }
                    {
                        Object.keys(this.state.nodes).map((nodeId, _) => {
                            return (
                                <Node
                                    key={nodeId}
                                    nodeId={nodeId}
                                    posX={this.state.nodes[nodeId].posX}
                                    posY={this.state.nodes[nodeId].posY}
                                    radius={this.state.nodes[nodeId].radius}
                                    fill={this.state.nodes[nodeId].fill}
                                    distances={this.state.nodes[nodeId].distances}
                                    changeAttributesNotification={this.nodeChangeAttributes}
                                    ref={(ref) => this.nodeRefs[nodeId]=ref}
                                />
                            )
                        })
                    }
                </svg>
            </div>
        )
    }
}