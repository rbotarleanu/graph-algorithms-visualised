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
        }

        this.graphRef = null;
        this.runAlgorithm = this.runAlgorithm.bind(this);
        this.generateGraph = this.generateGraph.bind(this);
        this.sliderUpdate = this.sliderUpdate.bind(this);
    }

    renderGraph(height, width) {
        this.graphDrawX = this.props.graphDrawX;
        this.graphDrawY = this.props.graphDrawY;
        this.graphWidth = width - this.state.nodeRadius * 2 - this.graphDrawX;
        this.graphHeight = height - this.state.nodeRadius * 2 - this.graphDrawY;

        var graph = this.makeGraph(10, 0.1);
        this.setState({
            renderGraph: true,
            nodes: graph.nodes,
            edges: graph.edges,
            width: this.graphWidth,
            height: this.graphHeight,
        });
    }

    makeGraph(numNodes, sparsity) {
        var alg = new RandomLayout(
            this.graphDrawX,
            this.graphDrawY,
            this.graphWidth,
            this.graphHeight,
            numNodes,
            sparsity
        );

        return alg.step();
    }

    runAlgorithm(algorithm) {
        var graph = this.graphRef;
        var nodes = graph.nodeRefs;
        var edges = graph.edgeRefs;

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

    generateGraph() {
        // var algorithm = new RandomMovement(50);
        var algorithm = new FruchtermanReingoldFD(
            this.props.graphDrawX + this.state.nodeRadius * 2,
            this.props.graphDrawY + this.state.nodeRadius,
            this.state.width,
            this.state.height,
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
        var graph = this.makeGraph(
            nodeSliderProps.currentValue,
            sparsitySliderProps.currentValue / 100);
        this.setState({
            nodes: graph.nodes,
            edges: graph.edges,
            nodeSliderProps: nodeSliderProps,
            sparsitySliderProps: sparsitySliderProps,
            numNodes: graph.nodes.length
        });

        this.graphRef.remake(graph);
    }

    componentDidMount() {
        const height = document.getElementById('graph').clientHeight;
        const width = document.getElementById('graph').clientWidth;
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
                        onClick={this.generateGraph}
                    >Generate graph</Button>{' '}
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