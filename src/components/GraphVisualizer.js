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


export default class GraphVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            renderGraph: false,
            nodeSliderProps: {
                currentValue: 10,
                max: 30,
                min: 2,
                step: 1
            },
            sparsitySliderProps: {
                currentValue: 5,
                max: 100,
                min: 0,
                step: 1
            },
            animationSpeedSliderProps: {
                currentValue: 10,
                max: 2000,
                min: 0,
                step: 10
            },
            nodeRadius: 10,
            numNodes: 10,
            selectedAlgorithm: 'Fruchterman-Reingold',
            sourceNode: "0",
            directed: false,
            weighted: false
        };

        this.graphRef = null;
        this.runAlgorithm = this.runAlgorithm.bind(this);
        this.sliderUpdate = this.sliderUpdate.bind(this);
        this.handleRunButton = this.handleRunButton.bind(this);
        this.handleGenerateGraphButton = this.handleGenerateGraphButton.bind(this);
    }

    renderGraph(height, width) {
        const graphDrawX = this.props.graphDrawX;
        const graphDrawY = this.props.graphDrawY;
        const graphWidth = width - this.state.nodeRadius * 2 - graphDrawX;
        const graphHeight = height - this.state.nodeRadius * 2 - graphDrawY;

        var graph = this.makeGraph(10, 0.1, graphWidth, graphHeight,
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
            numNodes: graph.nodes.length,
            animate: false
        });
        this.graphRef.remake(graph);
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
        // var algorithm = new RandomMovement(50);
        this.setState({animate: true});

        var builder = new AlgorithmBuilder(
            this.state.graphDrawX + this.state.nodeRadius * 2,
            this.state.graphDrawY + this.state.nodeRadius,
            this.state.graphWidth,
            this.state.graphHeight,
            this.state.sourceNode)
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
    }

    handleWeightedSelect(e) {
        var newWeigthed = this.state.weighted ? false : true;
        this.setState({weighted: newWeigthed});
        this.graphRef.updateWeightedStatus(newWeigthed);
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
                        notifyGraphRedraw={this.sliderUpdate}
                    />

                    <Form.Check
                        type="checkbox"
                        label="directed"
                        onChange={(e) => this.handleDirectedSelect(e)} />
                    <Form.Check 
                        type="checkbox"
                        label="weighted"
                        onChange={(e) => this.handleWeightedSelect(e)}
                        />
                    <Button
                        variant="primary"
                        onClick={this.handleGenerateGraphButton}
                    >Generate graph!</Button>

                    <SelectableContext.Provider value={false}>
                        <DropdownButton id="dropdown-basic-button"
                            title={"Algorithm: " + this.state.selectedAlgorithm}
                            onSelect={(e) => {this.setState({selectedAlgorithm: e})}}>
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
                            <Dropdown.Item eventKey="Best-first search">Best-first search</Dropdown.Item>
                            <Dropdown.Item eventKey="A*">A*</Dropdown.Item>
                        </DropdownButton>
                    </SelectableContext.Provider>

                    <Button
                        variant="primary"
                        onClick={this.handleRunButton}
                    >Run!</Button>
                </div>
                <div className="Graph" id="graph">
                    {this.state.renderGraph && 
                        <Graph
                            nodes={this.state.nodes}
                            edges={this.state.edges}
                            numNodes={this.state.numNodes}
                            nodeRadius={this.state.nodeRadius}
                            ref={(ref) => this.graphRef=ref}
                            sourceNode={this.state.sourceNode}
                            directed={this.state.directed}
                        />
                    }
                </div>
            </div>
        )
    }
}