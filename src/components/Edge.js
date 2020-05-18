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
            textY: textPos.y - 2
        };
    }

    center(x1, y1, x2, y2) {
        return {
            x: x1 + (x2 - x1) / 2,
            y: y1 + (y2 - y1) / 2
        }
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
            <line
                className="Line"
                x1={this.state.x1}
                y1={this.state.y1}
                x2={this.state.x2}
                y2={this.state.y2}
                style={
                    {"strokeWidth": this.state.width}}
            />
            <text
                x={this.state.textX}
                y={this.state.textY}
            >{this.state.weight}</text>
            </svg>
        )
    }
}