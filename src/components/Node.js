import React, { Component } from 'react';
import '../styles/Node.css';


export default class Node extends Component {

    constructor(props) {
        super(props);

        this.changePositionNotification = props.changePositionNotification;
        this.nodeId = props.nodeId;

        this.state = {
            posX: props.posX,
            posY: props.posY,
            radius: props.radius,
            dragging: false,
            cursorOffsetX: 0,
            cursorOffsetY: 0
        }
        // this.ctx = canvas.getContext("2d");
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    dragStart(e) {
        this.setState({
            dragging: true,
            cursorOffsetX: e.pageX - this.state.posX,
            cursorOffsetY: e.pageY - this.state.posY
        });
        
        e.stopPropagation();
        e.preventDefault();

    }

    dragEnd(e) {
        this.setState({dragging: false});

        e.stopPropagation();
        e.preventDefault();
    }

    dragMove(e) {
        if (!this.state.dragging) {
            return;
        }

        this.setState({
            posX: e.pageX - this.state.cursorOffsetX,
            posY: e.pageY - this.state.cursorOffsetY,
        });

        e.stopPropagation();
        e.preventDefault();

        this.changePositionNotification(
            this.nodeId, this.state.posX, this.state.posY);
    }

    render() {
        return (
            <circle
                cx={this.state.posX}
                cy={this.state.posY}
                r={this.state.radius}
                fill="red"
                onMouseDown={e => this.dragStart(e)}
                onMouseMove={e => this.dragMove(e)}
                onMouseUp={e => this.dragEnd(e)}
                onMouseLeave={e => this.dragEnd(e)}
                />
        )
    }
}