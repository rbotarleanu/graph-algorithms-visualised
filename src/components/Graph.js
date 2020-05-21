import React, { Component } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import '../styles/Graph.css';

export default class Graph extends Component {
    constructor(props) {
        super(props);

        var nodes = props.nodes;
        var edges = props.edges;
        var radius = props.nodeRadius;

        this.state = {nodes: {}, edges: {}, nodeIncidentEdges: {}};
        for (var i = 0; i < nodes.length; ++i) {
            var nodeId = i.toString();
            this.state.nodes[nodeId] = {
                "id": nodeId,
                "posX": nodes[i].x,
                "posY": nodes[i].y,
                radius: radius
            };
        }
        for (i = 0; i < edges.length; ++i) {
            var edgeId = i.toString();
            var node1 = edges[i].u.toString();
            var node2 = edges[i].v.toString();
            this.state.edges[edgeId] = {
                "node1":  node1,
                "node2":  node2,
                width: 1
            };
        }
        // this.state = {
        //     nodes: {
        //         "node1": {
        //             id: "node1",
        //             posX: 900,
        //             posY: 600,
        //             radius: 10
        //         },
        //         "node2": {
        //             id: "node2",
        //             posX: 200,
        //             posY: 50,
        //             radius: 10
        //         }
        //     },
        //     edges: {
        //         "edge1": {
        //             node1: "node1",
        //             node2: "node2",
        //             width: 1
        //         }
        //     },
        //     nodeIncidentEdges: {
        //         "node1":  {  
        //             "edgeId": "edge1"
        //         },
        //         "node2": {
        //             "edgeId": "edge1"
        //         }
        //     }
        // }

        this.edgeRefs = {};
        this.nodeRefs = {};
        this.nodeChangePosition = this.nodeChangePosition.bind(this);
    }

    nodeChangePosition(nodeId, nodePosX, nodePosY) {
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

    updateGraphState(nodeUpdates, edgeUpdates) {
        nodeUpdates.map(nodeUpdate => {
            var nodeId = nodeUpdate.nodeId;
            var nodePos = {
                x: nodeUpdate.x,
                y: nodeUpdate.y
            };
            this.nodeRefs[nodeId].updatePosition(nodePos);
        });
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