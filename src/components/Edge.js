import React, { Component } from 'react';
import '../styles/Edge.css';


export default class Edge extends Component {

    DIR_SRC_NON_HIGHLIGHT_COLOR = "rgb(245, 252, 255)";
    DIR_DST_NON_HIGHLIGHT_COLOR = "rgb(0, 0, 255)";

    DIR_SRC_HIGHLIGHT_COLOR = "rgb(252, 245, 255)";
    DIR_DST_HIGHLIGHT_COLOR = "rgb(0, 255, 0)";

    constructor(props) {
        super(props);
        this.edgeId = props.edgeId;

        this.state = this.buildState(props);

        this.gradId = "grad-" + this.edgeId;
        this.gradInvId = "gradInv-" + this.edgeId;
        this.notifyClick = props.notifyClick;
    }

    getColor(start) {
        if (!this.state.directed) {
            return this.state.highlight ? this.DIR_DST_HIGHLIGHT_COLOR : this.DIR_DST_NON_HIGHLIGHT_COLOR;
        }

        if (start) {
            // Color at source
            return this.state.highlight ? this.DIR_SRC_HIGHLIGHT_COLOR : this.DIR_SRC_NON_HIGHLIGHT_COLOR;
        } else {
            // Color at destination
            return this.state.highlight ? this.DIR_DST_HIGHLIGHT_COLOR : this.DIR_DST_NON_HIGHLIGHT_COLOR;
        }
    }

    buildState(props) {
        let textPos = this.center(props.x1, props.y1, props.x2, props.y2);

        return {
            width: props.width,
            x1: props.x1,
            y1: props.y1,
            x2: props.x2,
            y2: props.y2,
            weight: props.weight,
            textX: textPos.x + 2,
            textY: textPos.y - 2,
            directed: props.directed,
            node1: props.node1,
            node2: props.node2,
            nodeRadius: props.nodeRadius,
            highlight: props.highlight,
            showMenu: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.buildState(nextProps));
    }

    center(x1, y1, x2, y2) {
        return {
            x: x1 + (x2 - x1) / 2,
            y: y1 + (y2 - y1) / 2
        }
    }

    isDirected() {
        return this.state.directed;
    }

    getNode1() {
        return this.state.node1;
    }

    getNode2() {
        return this.state.node2;
    }

    getWeight() {
        return this.state.weight;
    }

    handleNodePositionChange(nodeIdx, x, y) {
        if (nodeIdx === 0) {
            this.setState({
                x1: x,
                y1: y
            });
        } else {
            this.setState({
                x2: x,
                y2: y
            });
        }

        let textPos = this.center(this.state.x1, this.state.y1,
                                  this.state.x2, this.state.y2);
        this.setState({
            textX: textPos.x,
            textY: textPos.y - 2,
        });
    }
    
    handleClick(e) {
        // blocks the click event on the graph svg to prevent the closure of the
        // editor box
        e.preventDefault();
        e.stopPropagation();

        this.notifyClick(this.edgeId, this.state.textX, this.state.textY)
    }

    render() {
        return (
            <svg>
                <defs>
                    <marker id="markerArrow"
                        markerWidth={this.state.nodeRadius}
                        markerHeight={this.state.nodeRadius}
                        refX={this.state.nodeRadius + 5}
                        refY={this.state.nodeRadius / 2}
                        orient="auto">
                        <path d="M0,0 L0,10 L6,5 L0,0" />
                    </marker>
                    {this.state.directed &&
                        <linearGradient id={this.gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{
                                stopColor: this.getColor(true),
                                stopOpacity: "1"
                            }} />
                            <stop offset="100%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                        </linearGradient>
                    }
                    {this.state.directed &&
                        <linearGradient id={this.gradInvId} x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                            <stop offset="100%" style={{
                                stopColor: this.getColor(true),
                                stopOpacity: "1"
                            }} />
                        </linearGradient>
                    }
                    {!this.state.directed &&
                        <linearGradient id={this.gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                            <stop offset="100%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                        </linearGradient>
                    }
                    {!this.state.directed &&
                        <linearGradient id={this.gradInvId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                            <stop offset="100%" style={{
                                stopColor: this.getColor(false),
                                stopOpacity: "1"
                            }} />
                        </linearGradient>
                    }
                </defs>
                <line
                    className="Line"
                    x1={this.state.x1}
                    x2={this.state.x2}
                    y1={this.state.y1}
                    y2={this.state.y2}
                    onClick={(e) => this.handleClick(e)}
                    style={{"strokeWidth": this.state.width, markerEnd: this.state.directed ? "url(#markerArrow)" : ""}}
                    stroke={this.state.x1 < this.state.x2 ? "url(#" + this.gradId + ")" : "url(#" + this.gradInvId + ")"}
                />

                <text
                    x={this.state.textX}
                    y={this.state.textY}
                    onClick={(e) => this.handleClick(e)}
                >{this.state.weight}</text>

            </svg>
        )
    }
}