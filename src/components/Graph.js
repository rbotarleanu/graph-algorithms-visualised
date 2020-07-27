import React, { Component } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import '../styles/Graph.css';
import { RandomLayout } from '../algorithms/layout.js';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.radius = props.nodeRadius;

        this.state = {nodes: {}, edges: {},
                      nodeIncidentEdges: {},
                      sourceNode: props.sourceNode,
                      targetNode: props.targetNode,
                      directed: props.directed,
                      editorMode: false,
                      editorPos: {x: 0, y: 0},
                      selectedEdge: null};
        this.setGraphElements(this.state, props.nodes, props.edges);
        this.edgeRefs = {};
        this.nodeRefs = {};

        this.updateEditorTransaction = props.updateTransaction;
        this.nodeChangeAttributes = this.nodeChangeAttributes.bind(this);
        this.edgeChangeAttributes = this.edgeChangeAttributes.bind(this);
        this.nodeOnClick = this.nodeOnClick.bind(this);
        this.remake = this.remake.bind(this);
        this.updateDirection = this.updateDirection.bind(this);
        this.notifyEdgeClick = this.notifyEdgeClick.bind(this);
    }

    getNodeColor(nodeId) {
        var color = 'red';
        if (this.state.sourceNode === nodeId) {
            color = 'blue';
        } else if (this.state.targetNode === nodeId) {
            color = 'purple';
        }
        
        return color;
    }

    setGraphElements(state, nodes, edges) {
        for (var i = 0; i < nodes.length; ++i) {
            var nodeId = i.toString();

            state.nodes[nodeId] = {
                "id": nodeId,
                "posX": nodes[i].x,
                "posY": nodes[i].y,
                radius: this.radius,
                fill: this.getNodeColor(nodeId),
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

    remake(graph, sourceNode, targetNode) {
        var newState = this.state;
        const nodes = graph.nodes;
        const edges = graph.edges;

        newState.nodes = {};
        newState.edges = {};
        newState.nodeIncidentEdges = {};
        newState.nodeRefs = {};
        newState.edgeRefs = {};
        newState.targetNode = targetNode;
        newState.sourceNode = sourceNode;

        this.setGraphElements(newState, nodes, edges);
        this.setState(newState);
        requestAnimationFrame(() => this.filterUnusedRefs());
    }

    filterUnusedRefs() {
        var filteredNodeRefs = {};
        for (var nodeRef in this.nodeRefs) {
            if (this.nodeRefs[nodeRef] === null) {
                continue;
            }
            this.nodeRefs[nodeRef].fill = this.getNodeColor(nodeRef);
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

        if (!isNaN(edgeWeight)) {
            edges[edgeId].weight = edgeWeight;
        }

        if (edgeHighlight !== undefined) {
            edges[edgeId].highlight = edgeHighlight;
        }

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
        for (var nodeId in this.state.nodes) {
            let fill = this.getNodeColor(nodeId);
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

    nodeOnClick(nodeId) {
        this.updateEditorTransaction(nodeId);
    }

    updateSourceNode(nodeId) {
        this.setState({sourceNode: nodeId});
    }

    updateTargetNode(nodeId) {
        this.setState({targetNode: nodeId});
    }

    hasEdge(u, v) {
        for (var edgeId in this.edges) {
            let node1 = this.edges[edgeId].node1;
            let node2 = this.edges[edgeId].node1;

            if (node1 === u && node2 === v) {
                return true;
            }

            if (!this.state.directed && node2 === u && node1 === v) {
                return true;
            }
        }

        return false;
    }

    addEdge(edgeId, u, v) {
        let edges = this.state.edges;
        edges[edgeId] = {
            "node1": u,
            "node2": v,
            width: 1,
            weight: RandomLayout.makeRandomWeight(),
            highlight: false
        }
        this.setState({edges: edges});

        requestAnimationFrame(() => {this.resetGraphAlgorithmVisuals();});
    }

    notifyEdgeClick(edgeId, edgePosX, edgePosY) {
        let newEditorPos = {x: edgePosX - 100, y: edgePosY - 50};
        this.setState({editorMode: true, editorPos: newEditorPos, selectedEdge: edgeId});
    }

    handleEdgeWeightChange(e) {
        var newWeight = e.target.value;

        if (!newWeight) {
            newWeight = 0;
        }

        newWeight = Number.parseInt(newWeight);
        this.edgeChangeAttributes(this.state.selectedEdge, newWeight, undefined, undefined);
        
        requestAnimationFrame(() => {this.resetGraphAlgorithmVisuals()});
    }

    handleDeleteEdge() {
        var newState = this.state;
        let edgeId = this.state.selectedEdge;

        delete newState.edges[edgeId];
        newState.editorMode = false;
        newState.selectedEdge = null;

        this.setState(newState);
        this.setGraphElements(newState, newState.nodes, newState.edges);
        requestAnimationFrame(() => {this.filterUnusedRefs()});
    }

    render() {
        return (
            <div className="Graph">
                <svg onClick={() => {this.setState({editorMode: false})}}>
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
                                    notifyClick={this.notifyEdgeClick}
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
                                    onClickNotification={this.nodeOnClick}
                                    ref={(ref) => this.nodeRefs[nodeId]=ref}
                                />
                            )
                        })
                    }
                </svg>
                {this.state.editorMode && 
                    <div
                        className="edgeEditor"
                        style={{
                            position: "absolute",
                            top: this.state.editorPos.y,
                            left: this.state.editorPos.x,
                            float: "left",
                            textAlign: "center",
                            border: "1px inset grey",
                            zIndex: 10,
                            backgroundColor: "rgb(233, 236, 245)",
                            borderRadius: 5
                        }}>                    
                    <form onSubmit={e => {e.preventDefault();}}>
                        <a>Weight</a> <input
                            className="edgeWeightInput"
                            type="text"
                            value={this.state.edges[this.state.selectedEdge].weight}
                            onChange={(val) => {this.handleEdgeWeightChange(val)}}/>
                        <Button
                            variant='info'
                            onClick={() => this.handleDeleteEdge()}
                            >Delete</Button>
                    </form>
                </div>}
            </div>
        )
    }
}