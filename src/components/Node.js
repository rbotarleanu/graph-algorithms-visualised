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
            fill: props.fill
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
            </svg>
        )
    }
}