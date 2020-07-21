/*
The toolbar has various functionalities that control what the user is seeing on
the screen.
*/

import React, { Component } from 'react';
import '../styles/GraphVisualizer.css';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Graph from './Graph.js';
import Slider from './Slider.js';
import { RandomLayout } from '../algorithms/layout.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlgorithmBuilder from '../algorithms/AlgorithmMapping.js';
import SelectableContext from 'react-bootstrap/SelectableContext';
import Form from 'react-bootstrap/Form';
import NodeUpdate from '../algorithms/NodeUpdate.js';


export default class GraphVisualizer extends Component {
    EDITOR_OPTIONS = {
        'none': 'none',
        'source': 'sourceNode',
        'target': 'targetNode',
        'edge': 3
    };

    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            renderGraph: false,
            nodeSliderProps: {
                currentValue: 7,
                max: 30,
                min: 2,
                step: 1
            },
            sparsitySliderProps: {
                currentValue: 30,
                max: 100,
                min: 0,
                step: 1
            },
            animationSpeedSliderProps: {
                currentValue: 100,
                max: 2000,
                min: 0,
                step: 10
            },
            nodeRadius: 10,
            selectedAlgorithm: 'Fruchterman-Reingold',
            sourceNode: "0",
            targetNode: "6",
            directed: false,
            weighted: false,
            editorMode: this.EDITOR_OPTIONS.none,
            editorMemory: []
        };

        this.graphRef = null;
        this.runAlgorithm = this.runAlgorithm.bind(this);
        this.sliderUpdate = this.sliderUpdate.bind(this);
        this.handleRunButton = this.handleRunButton.bind(this);
        this.handleGenerateGraphButton = this.handleGenerateGraphButton.bind(this);
        this.updateEditor = this.updateEditor.bind(this);
    }

    renderGraph(height, width) {
        const graphDrawX = this.props.graphDrawX;
        const graphDrawY = this.props.graphDrawY;
        const graphWidth = width - this.state.nodeRadius * 2 - graphDrawX;
        const graphHeight = height - this.state.nodeRadius * 2 - graphDrawY;
        const sparsity = this.state.sparsitySliderProps.currentValue / 100;

        var graph = this.makeGraph(this.state.nodeSliderProps.currentValue,
            sparsity, graphWidth, graphHeight,
            graphDrawX, graphDrawY);
        this.setState({
            renderGraph: true,
            nodes: graph.nodes,
            edges: graph.edges,
            graphWidth: graphWidth,
            graphHeight: graphHeight,
            graphDrawX: graphDrawX,
            graphDrawY: graphDrawY
        });
    }

    makeGraph(numNodes, sparsity, width, height, startX, startY) {
        var alg = new RandomLayout(
            startX,
            startY,
            width,
            height,
            numNodes,
            sparsity
        );

        return alg.step();
    }

    handleGenerateGraphButton() {
        let targetNodeIdx = this.state.nodeSliderProps.currentValue - 1;
        let sourceNodeIdx = "0";
        let targetNode = targetNodeIdx.toString();
        let sourceNode = sourceNodeIdx.toString();

        var graph = this.makeGraph(
            this.state.nodeSliderProps.currentValue,
            this.state.sparsitySliderProps.currentValue / 100,
            this.state.graphWidth,
            this.state.graphHeight,
            this.state.graphDrawX,
            this.state.graphDrawY);
        
        this.setState({
            nodes: graph.nodes,
            edges: graph.edges,
            sourceNode: sourceNode,
            targetNode: targetNode,
            animate: false
        });
        this.graphRef.remake(graph, sourceNode, targetNode);
    }

    runAlgorithm(algorithm) {
        var graph = this.graphRef;
        var nodes = graph.getNodeRefs();
        var edges = graph.getEdgeRefs();

        var updates = algorithm.step(nodes, edges);
        if (updates === null) {
            this.setState({algorithmIsRunning: false});
            return;
        }

        graph.updateGraphState(updates.nodeUpdates, updates.edgeUpdates);
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                if (this.state.animate === true) {
                    this.runAlgorithm(algorithm)};
                },
            this.state.animationSpeedSliderProps.currentValue);
        });
    }

    handleRunButton() {
        this.setState({animate: true});

        var builder = new AlgorithmBuilder(
            this.state.graphDrawX + this.state.nodeRadius * 2,
            this.state.graphDrawY + this.state.nodeRadius,
            this.state.graphWidth,
            this.state.graphHeight,
            this.state.sourceNode,
            this.state.targetNode);
        var algorithm = builder.build(this.state.selectedAlgorithm);

        if (algorithm === null) {
            return;
        }

        this.runAlgorithm(algorithm);
    }

    sliderUpdate(property, newValue) {
        var nodeSliderProps = this.state.nodeSliderProps;
        var sparsitySliderProps = this.state.sparsitySliderProps;
        var animationSpeedSliderProps = this.state.animationSpeedSliderProps;
        switch (property) {
            case 'Nodes':
                nodeSliderProps.currentValue = newValue;
                break;
            case 'Sparsity':
                sparsitySliderProps.currentValue = newValue;
                break;
            case 'Animation speed':
                animationSpeedSliderProps.currentValue = newValue;
                break;
            default:
                return;
        }
        this.setState({
            nodeSliderProps: nodeSliderProps,
            sparsitySliderProps: sparsitySliderProps,
            animationSpeedSliderProps: animationSpeedSliderProps
        });
    }

    componentDidMount() {
        const height = document.getElementById('visualizer').clientHeight * 0.9;
        const width = document.getElementById('visualizer').clientWidth * 0.9;
        this.renderGraph(height, width);
    }

    handleDirectedSelect(e) {
        var newDirection = this.state.directed ? false : true;
        this.setState({directed: newDirection});
        this.graphRef.updateDirection(newDirection);
        this.graphRef.resetGraphAlgorithmVisuals();
    }

    handleWeightedSelect(e) {
        var newWeigthed = this.state.weighted ? false : true;
        this.setState({weighted: newWeigthed});
        this.graphRef.updateWeightedStatus(newWeigthed);
        this.graphRef.resetGraphAlgorithmVisuals();
    }

    handleNodeSelection(nodeToChange) {
        if (this.state.editorMode !== this.EDITOR_OPTIONS.none) {
            return;
        }

        let otherNode = nodeToChange === 'sourceNode' ? this.state.targetNode : this.state.sourceNode;
        let graph = this.graphRef;
        var nodeUpdates = [];

        for (var nodeId in graph.getNodes()) {
            if (nodeId === otherNode) {
                continue;
            }

            let color = 'grey';
            nodeUpdates.push(new NodeUpdate(nodeId, undefined, undefined, color, undefined));
        }

        graph.updateGraphState(nodeUpdates, []);

        if (nodeToChange === 'sourceNode') {
            this.setState({editorMode: this.EDITOR_OPTIONS.source});
        } else {
            this.setState({editorMode: this.EDITOR_OPTIONS.target});
        }
    }

    handleAddEdge() {
        if (this.state.editorMode !== this.EDITOR_OPTIONS.none) {
            return;
        }

        let graph = this.graphRef;
        var nodeUpdates = [];

        for (var nodeId in graph.getNodes()) {
            let color = 'grey';
            nodeUpdates.push(new NodeUpdate(nodeId, undefined, undefined, color, undefined));
        }

        graph.updateGraphState(nodeUpdates, []);
        this.setState({editorMode: this.EDITOR_OPTIONS.edge});
    }

    _updateNode(selectedNodeId) {
        let otherNode = this.state.editorMode === this.EDITOR_OPTIONS.source ? this.state.targetNode : this.state.sourceNode;
        var nodeUpdates = [];
        let graph = this.graphRef;

        for (var nodeId in graph.getNodes()) {
            if (nodeId === otherNode) {
                continue;
            }
            
            var color = 'red';
            if (nodeId === selectedNodeId) {
                color = this.state.editorMode === this.EDITOR_OPTIONS.source ? 'blue' : 'purple';
            }

            nodeUpdates.push(new NodeUpdate(nodeId, undefined, undefined, color, undefined));
        }

        let update = {[this.state.editorMode]: selectedNodeId};
        graph.updateGraphState(nodeUpdates, []);

        if (this.state.editorMode === this.EDITOR_OPTIONS.source) {
            graph.updateSourceNode(selectedNodeId);
        } else {
            graph.updateTargetNode(selectedNodeId);
        }

        this.setState({
            editorMode: this.EDITOR_OPTIONS.none,
            editorMemory: [],
            ...update
            });
    }

    _addEdge(nodeIds) {
        let u = nodeIds[0];
        let v = nodeIds[1];
        let graph = this.graphRef;
        let edges = graph.getEdges();
        if (graph.hasEdge(u, v)) {
            return;
        }

        var newEdgeId = Object.keys(edges).length + 1;
        newEdgeId = newEdgeId.toString();

        graph.addEdge(newEdgeId, u, v);

        this.setState({
            editorMode: this.EDITOR_OPTIONS.none,
            editorMemory: []
        });
    }

    updateEditor(selectedNodeId) {
        if (this.state.editorMode === this.EDITOR_OPTIONS.none) {
            return;
        }
        
        if (this.state.editorMode !== this.EDITOR_OPTIONS.edge) {
            this._updateNode(selectedNodeId);
        } else {
            let editorMemory = this.state.editorMemory;
            editorMemory.push(selectedNodeId);

            if (editorMemory.length === 2) {
                this._addEdge(editorMemory);
            } else {
                this.setState({editorMemory: editorMemory});
                this.graphRef.updateGraphState(
                    [new NodeUpdate(selectedNodeId, undefined, undefined, 'green', undefined)],
                    []);
            }
        }
    }

    render() {
        return (
            <div className="visualizer" id="visualizer">
                <div className="Toolbar">
                    <Slider
                        label="Nodes"
                        sliderProps={this.state.nodeSliderProps}
                        um=""
                        notifyGraphRedraw={this.sliderUpdate}
                    />
                    <Slider
                        label="Sparsity"
                        sliderProps={this.state.sparsitySliderProps}
                        um="%"
                        notifyGraphRedraw={this.sliderUpdate}
                    />
                    <Slider
                        label="Animation speed"
                        sliderProps={this.state.animationSpeedSliderProps}
                        um="ms"
                        disabled={this.state.inEditorMode}
                        notifyGraphRedraw={this.sliderUpdate}
                    />

                    <Form.Check
                        type="checkbox"
                        label="directed"
                        disabled={this.state.inEditorMode}
                        onChange={(e) => this.handleDirectedSelect(e)} />
                    <Form.Check 
                        type="checkbox"
                        label="weighted"
                        disabled={this.state.inEditorMode}
                        onChange={(e) => this.handleWeightedSelect(e)}
                        />

                    <SelectableContext.Provider value={false}>
                        <DropdownButton id="dropdown-basic-button"
                            title={"Algorithm: " + this.state.selectedAlgorithm}
                            disabled={this.state.inEditorMode}
                            onSelect={(e) => {
                                this.graphRef.resetGraphAlgorithmVisuals();
                                this.setState({selectedAlgorithm: e})}
                            }>
                            <Dropdown.Header>Layout Algorithms</Dropdown.Header>
                            <Dropdown.Item eventKey="Fruchterman-Reingold">Fruchterman-Reingold</Dropdown.Item>

                            <Dropdown.Header>Unweighted Search Algorithms</Dropdown.Header>
                            <Dropdown.Item eventKey="Depth-first search">Depth-first search</Dropdown.Item>
                            <Dropdown.Item eventKey="Breadth-first search">Breadth-first search</Dropdown.Item>

                            <Dropdown.Header>Weighted uninformed search algorithms</Dropdown.Header>
                            <Dropdown.Item eventKey="Bellman-Ford">Bellman-Ford</Dropdown.Item>
                            <Dropdown.Item eventKey="Floyd-Warshall">Floyd-Warshall</Dropdown.Item>
                            <Dropdown.Item eventKey="Dijkstra">Dijkstra</Dropdown.Item>

                            <Dropdown.Header>Weighted informed search algorithms</Dropdown.Header>
                            <Dropdown.Item eventKey="A*">A*</Dropdown.Item>
                        </DropdownButton>
                    </SelectableContext.Provider>

                    <div className="btn-toolbar"  style={{float: "right"}}>
                        <Button
                            variant="outline-primary"
                            onClick={this.handleGenerateGraphButton}
                            disabled={this.state.inEditorMode}
                        >Generate graph</Button>

                        <Button
                            variant="outline-primary"
                            onClick={() => {this.handleNodeSelection("sourceNode")}}
                            disabled={this.state.inEditorMode}
                        >Source</Button>

                        <Button
                            variant="outline-primary"
                            onClick={() => {this.handleNodeSelection("targetNode")}}
                            disabled={this.state.inEditorMode}
                            >Target</Button>
                        
                        <Button
                            variant="outline-primary"
                            disabled={this.state.inEditorMode}
                            onClick={() => {this.handleAddEdge()}}
                            >Add edge</Button>

                        <Button
                            variant="outline-primary"
                            onClick={this.handleRunButton}
                            disabled={this.state.inEditorMode}
                        >Run</Button>
                    </div>
                </div>
                <div className="Graph" id="graph">
                        {this.state.renderGraph && 
                            <Graph
                                nodes={this.state.nodes}
                                edges={this.state.edges}
                                numNodes={this.state.nodeSliderProps.currentValue}
                                nodeRadius={this.state.nodeRadius}
                                ref={(ref) => this.graphRef=ref}
                                sourceNode={this.state.sourceNode}
                                targetNode={this.state.targetNode}
                                directed={this.state.directed}
                                updateTransaction={this.updateEditor}
                            />
                        }
                </div>
            </div>
        )
    }
}