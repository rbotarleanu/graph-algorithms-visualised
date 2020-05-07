import React, { Component } from 'react';
import '../styles/Edge.css';


export default class Edge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            x1: props.x1,
            y1: props.y1,
            x2: props.x2,
            y2: props.y2
        };
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
    }

    render() {
        return (
            <line
                className="Line"
                x1={this.state.x1}
                y1={this.state.y1}
                x2={this.state.x2}
                y2={this.state.y2}
                style={
                    {"strokeWidth": this.state.width}}
            />
        )
    }
}