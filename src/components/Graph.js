import React, { Component } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import '../styles/Graph.css';

export default class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodes: {
                "node1": {
                    id: "node1",
                    posX: 500,
                    posY: 150,
                    radius: 50
                },
                "node2": {
                    id: "node2",
                    posX: 200,
                    posY: 50,
                    radius: 50
                }
            },
            edges: {
                "edge1": {
                    node1: "node1",
                    node2: "node2",
                    width: 1
                }
            },
            nodeIncidentEdges: {
                "node1":  {  
                    "edgeId": "edge1"
                },
                "node2": {
                    "edgeId": "edge1"
                }
            }
        }

        this.edgeRefs = {};
        this.nodeChangePosition = this.nodeChangePosition.bind(this);
    }

    nodeChangePosition(nodeId, nodePosX, nodePosY) {
        var edgeId = this.state.nodeIncidentEdges[nodeId].edgeId;
        var edge = this.state.edges[edgeId];

        this.edgeRefs[edgeId].handleNodePositionChange(
            nodeId === edge.node1 ? 0: 1,
            nodePosX,
            nodePosY
        );
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
                                />
                            )
                        })
                    }
                </svg>
            </div>
        )
    }
}