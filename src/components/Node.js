import React, { Component } from 'react';
import '../styles/Node.css';
import Draggable from 'react-draggable';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.changeAttributesNotification = props.changeAttributesNotification;
        this.nodeId = props.nodeId;
        this.nodeRef = React.createRef();
        this.state = this.buildState(props);
    }

    buildState(props) {
        return {
            nodePosition: {
                x: props.posX,
                y: props.posY
            },
            x: props.posX,
            y: props.posY,
            radius: props.radius,
            value: props.value,
            fill: props.fill,
            distances: props.distances
        };
    }

    componentWillReceiveProps(nextProps) {
        this.nodeId = nextProps.nodeId;
        this.setState(this.buildState(nextProps));
    }

    dragMove(e, ui) {
        const newPosX = this.state.nodePosition.x + ui.deltaX;
        const newPosY = this.state.nodePosition.y + ui.deltaY;
        this.setState({nodePosition: {x: newPosX, y: newPosY}});

        e.stopPropagation();
        e.preventDefault();

        this.changeAttributesNotification(
            this.nodeId, newPosX, newPosY, this.state.fill);
    }

    getX() {
        return this.state.nodePosition.x;
    }

    getY() {
        return this.state.nodePosition.y;
    }

    getId() {
        return this.nodeId;
    }

    printDistances() {
        var s = "";
        for (var node in this.state.distances) {
            let value = this.state.distances[node] === Infinity ? "∞" : this.state.distances[node];
            s += node + ": " + value + ", ";
        }

        return s.substring(0, s.length - 2);
    }

    render() {
        return (
            <svg>
            <Draggable 
                nodeRef={this.nodeRef}
                position={this.state.nodePosition}
                onDrag={(e, ui) => this.dragMove(e, ui)}
            >
                <circle
                    cx={0}
                    cy={0}
                    ref={this.nodeRef}
                    r={this.state.radius}
                    fill={this.state.fill}
                />
            </Draggable>
                <text
                    x={this.state.nodePosition.x - this.state.radius / 2 + 1}
                    y={this.state.nodePosition.y - this.state.radius - 2}
                    style={{font: "15px serif", zIndex: -1}}
                >
                    {this.nodeId}
                </text>
                <text
                    x={this.state.nodePosition.x - this.state.radius * 30}
                    y={this.state.nodePosition.y - this.state.radius * 3}
                    style={{font: "15px serif", zIndex: -1}}
                >
                    {this.state.distances ? this.printDistances() : ""}
                </text>
            </svg>
        )
    }
}