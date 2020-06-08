import React, { Component } from 'react';
import '../styles/Edge.css';


export default class Edge extends Component {

    constructor(props) {
        super(props);
        let textPos = this.center(props.x1, props.y1, props.x2, props.y2);

        this.state = {
            width: props.width,
            x1: props.x1,
            y1: props.y1,
            x2: props.x2,
            y2: props.y2,
            weight: props.weight,
            textX: textPos.x,
            textY: textPos.y - 2,
            directed: props.directed,
            node1: props.node1,
            node2: props.node2
        };
    }

    center(x1, y1, x2, y2) {
        return {
            x: x1 + (x2 - x1) / 2,
            y: y1 + (y2 - y1) / 2
        }
    }

    getNode1() {
        return this.state.node1;
    }

    getNode2() {
        return this.state.node2;
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

    render() {
        return (
            <svg>
            <defs>
                {this.state.directed &&
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{
                            stopColor: "rgb(245, 252, 255)",
                            stopOpacity: "1"
                        }} />
                        <stop offset="100%" style={{
                            stopColor: "rgb(0, 0, 255)",
                            stopOpacity: "1"
                        }} />
                    </linearGradient>
                }
                {this.state.directed &&
                    <linearGradient id="gradInv" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" style={{
                            stopColor: "rgb(245, 252, 255)",
                            stopOpacity: "1"
                        }} />
                        <stop offset="100%" style={{
                            stopColor: "rgb(0, 0, 255)",
                            stopOpacity: "1"
                        }} />
                    </linearGradient>
                }
                {!this.state.directed &&
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{
                            stopColor: "rgb(0,0,255)",
                            stopOpacity: "1"
                        }} />
                        <stop offset="100%" style={{
                            stopColor: "rgb(0,0,255)",
                            stopOpacity: "1"
                        }} />
                    </linearGradient>
                }
                {!this.state.directed &&
                    <linearGradient id="gradInv" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{
                            stopColor: "rgb(0,0,255)",
                            stopOpacity: "1"
                        }} />
                        <stop offset="100%" style={{
                            stopColor: "rgb(0,0,255)",
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
                style={{"strokeWidth": this.state.width}}
                stroke={this.state.x1 < this.state.x2 ? "url(#grad)" : "url(#gradInv"}
            />
            <text
                x={this.state.textX}
                y={this.state.textY}
            >{this.state.weight}</text>
            </svg>
        )
    }
}