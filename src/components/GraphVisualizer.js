/*
The toolbar has various functionalities that control what the user is seeing on
the screen.
*/

import React, { Component } from 'react';
import '../styles/GraphVisualizer.css';
import { Button } from 'react-bootstrap';
import Graph from './Graph.js';
import Slider from './Slider.js';
import { RandomLayout, FruchtermanReingoldFD } from '../algorithms/layout.js';


export default class GraphVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderGraph: false,
            nodeSliderProps: {
                currentValue: 10,
                max: 100,
                min: 2,
                step: 5
            },
            sparsitySliderProps: {
                currentValue: 5,
                max: 100,
                min: 0,
                step: 1
            },
            nodeRadius: 10,
            numNodes: 10,
            animationSpeed: 100
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
            numNodes: graph.nodes.length
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
            setTimeout(() => {this.runAlgorithm(algorithm)},
                              this.state.animationSpeed);
        });
    }

    handleRunButton() {
        // var algorithm = new RandomMovement(50);
        var algorithm = new FruchtermanReingoldFD(
            this.state.graphDrawX + this.state.nodeRadius * 2,
            this.state.graphDrawY + this.state.nodeRadius,
            this.state.graphWidth,
            this.state.graphHeight,
            50, 0.001);
        this.runAlgorithm(algorithm);
    }

    sliderUpdate(property, newValue) {
        var nodeSliderProps = this.state.nodeSliderProps;
        var sparsitySliderProps = this.state.sparsitySliderProps;
        switch (property) {
            case 'Nodes':
                nodeSliderProps.currentValue = newValue;
                break;
            case 'Sparsity':
                sparsitySliderProps.currentValue = newValue;
                break;
            default:
                return;
        }
        this.setState({
            nodeSliderProps: nodeSliderProps,
            sparsitySliderProps: sparsitySliderProps
        });
    }

    componentDidMount() {
        const height = document.getElementById('visualizer').clientHeight * 0.9;
        const width = document.getElementById('visualizer').clientWidth * 0.9;
        this.renderGraph(height, width);
    }

    render() {
        return (
            <div className="visualizer" id="visualizer">
                <div className="Toolbar">
                    <Slider
                        label="Nodes"
                        sliderProps={this.state.nodeSliderProps}
                        notifyGraphRedraw={this.sliderUpdate}
                    />
                    <Slider
                        label="Sparsity"
                        sliderProps={this.state.sparsitySliderProps}
                        isPerc={true}
                        notifyGraphRedraw={this.sliderUpdate}
                    />
                    <Button
                        variant="primary"
                        onClick={this.handleGenerateGraphButton}
                    >Generate graph!</Button>
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
                        />
                    }
                </div>
            </div>
        )
    }
}