import React, { Component } from 'react';
import '../styles/Node.css';
import Draggable from 'react-draggable';




export default class Node extends Component {

    constructor(props) {
        super(props);

        this.changePositionNotification = props.changePositionNotification;
        this.nodeId = props.nodeId;
        this.nodeRef = React.createRef();

        this.state = {
            posX: props.posX,
            posY: props.posY,
            radius: props.radius,
            draggableX: props.posX,
            draggableY: props.posY
        }
    }

    dragMove(e) {
        this.setState({
            draggableX: this.state.draggableX + e.movementX,
            draggableY: this.state.draggableY + e.movementY,
        });

        e.stopPropagation();
        e.preventDefault();

        this.changePositionNotification(
            this.nodeId, this.state.draggableX, this.state.draggableY);
    }

    render() {
        return (
            <Draggable 
                nodeRef={this.nodeRef}
                onDrag={e => this.dragMove(e)}
                >
            <circle
                cx={this.state.posX}
                cy={this.state.posY}
                ref={this.nodeRef}
                r={this.state.radius}
                fill="red"
                />
            </Draggable>
        )
    }
}