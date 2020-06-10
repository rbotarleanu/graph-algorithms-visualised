import React, { Component } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import '../styles/Graph.css';

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.radius = props.nodeRadius;

        this.state = {nodes: {}, edges: {},
                      nodeIncidentEdges: {}};
        this.setGraphElements(this.state, props.nodes, props.edges);

        this.edgeRefs = {};
        this.nodeRefs = {};

        this.nodeChangePosition = this.nodeChangePosition.bind(this);
        this.remake = this.remake.bind(this);
    }

    setGraphElements(state, nodes, edges) {
        for (var i = 0; i < nodes.length; ++i) {
            var nodeId = i.toString();
            state.nodes[nodeId] = {
                "id": nodeId,
                "posX": nodes[i].x,
                "posY": nodes[i].y,
                radius: this.radius
            };
        }
        for (i = 0; i < edges.length; ++i) {
            var edgeId = i.toString();
            var node1 = edges[i].u.toString();
            var node2 = edges[i].v.toString();
            state.edges[edgeId] = {
                "node1":  node1,
                "node2":  node2,
                width: 1
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
        });
    }

    nodeChangePosition(nodeId, nodePosX, nodePosY) {
        var stateNodes = this.state.nodes;
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

        this.setState({nodes: stateNodes});
    }

    updateGraphState(nodeUpdates, edgeUpdates) {
        nodeUpdates.map(nodeUpdate => {
            var nodeId = nodeUpdate.nodeId;
            var nodePos = {
                x: nodeUpdate.x,
                y: nodeUpdate.y
            };
            this.nodeRefs[nodeId].updatePosition(nodePos);
            return null;
        });
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
                                    width={this.state.edges[edgeId].width}
                                    x1={this.state.nodes[this.state.edges[edgeId].node1].posX}
                                    y1={this.state.nodes[this.state.edges[edgeId].node1].posY}
                                    x2={this.state.nodes[this.state.edges[edgeId].node2].posX}
                                    y2={this.state.nodes[this.state.edges[edgeId].node2].posY}
                                    node1={this.state.edges[edgeId].node1}
                                    node2={this.state.edges[edgeId].node2}
                                    ref={(ref) => this.edgeRefs[edgeId]=ref}
                                    directed={true}
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
                                    fill="red"
                                    changePositionNotification={this.nodeChangePosition}
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