import React, { Component } from 'react';
import '../styles/Node.css';
import Draggable from 'react-draggable';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.changePositionNotification = props.changePositionNotification;
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
            value: props.value
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

        this.changePositionNotification(
            this.nodeId, newPosX, newPosY);
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

    updatePosition(newPos) {
        this.setState({nodePosition: {x: newPos.x, y: newPos.y}});

        this.changePositionNotification(
            this.nodeId, newPos.x, newPos.y);
    }

    finalizeDragMovement(e) {
        // this.setState({
        //     initX: this.this.state.posX,
        //     initY: this.state.posY
        // });
    }

    render() {
        return (
            <svg>
            <Draggable 
                nodeRef={this.nodeRef}
                position={this.state.nodePosition}
                onDrag={(e, ui) => this.dragMove(e, ui)}
                onStop={e => this.finalizeDragMovement(e)}
            >
                <circle
                    cx={0}
                    cy={0}
                    ref={this.nodeRef}
                    r={this.state.radius}
                    fill="red"
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