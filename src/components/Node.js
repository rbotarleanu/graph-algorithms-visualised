import React, { Component } from 'react';
import '../styles/Node.css';
import Draggable from 'react-draggable';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.changeAttributesNotification = props.changeAttributesNotification;
        this.onClickNotification = props.onClickNotification;
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
            var values = this.state.distances[node];

            if (values === undefined) {
                s += "";
                continue;
            }
            

            if (values['f'] !== undefined) {
                let gScore = values['g'] === Infinity ? "∞" : values['g'];
                let fScore = values['f'] === Infinity ? "∞" : values['f'];

                value = gScore + "(" + fScore + ")";
            } else {
                var value = values === Infinity ? "∞" : values;
            }

            s += node + ": " + value + ", ";
        }

        return s.substring(0, s.length - 2);
    }

    getDistancesOffset(distances) {
        if (!distances || Object.keys(distances).length === 0) {
            return 0;
        }

        if (distances[this.nodeId] === undefined) {
            return 0;
        }

        if (distances[this.nodeId]['f'] !== undefined) {
            return (!distances ? 0 : Object.keys(distances).length * 25);
        } else {
            return (!distances ? 0 : Object.keys(distances).length * 15);
        }
    }

    render() {
        return (
            <svg>
            <Draggable 
                nodeRef={this.nodeRef}
                position={this.state.nodePosition}
                onDrag={(e, ui) => this.dragMove(e, ui)}
                onMouseDown={() => this.onClickNotification(this.nodeId)}
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
                    x={this.state.nodePosition.x - this.getDistancesOffset(this.state.distances)}
                    y={this.state.nodePosition.y - this.state.radius * 3}
                    style={{font: "15px serif", zIndex: -1}}
                >
                    {this.state.distances ? this.printDistances() : ""}
                </text>
            </svg>
        )
    }
}