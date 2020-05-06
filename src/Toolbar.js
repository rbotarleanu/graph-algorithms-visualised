/*
The toolbar has various functionalities that control what the user is seeing on
the screen.
*/

import React, { Component } from 'react';
import './Toolbar.css';
import Slider from './Slider.js';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeCountPicker: {
                currentValue: 10,
                max: 100,
                min: 2,
                step: 5
            },
            sparsityPicker: {
                currentValue: 10,
                max: 100,
                min: 0,
                step: 1
            }
        }
    }

    render() {
        return (
            <div className="Toolbar">
                <Slider
                    label="Nodes"
                    sliderProps={this.state.nodeCountPicker}
                />
            </div>
        )
    }
}