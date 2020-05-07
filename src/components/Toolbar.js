/*
The toolbar has various functionalities that control what the user is seeing on
the screen.
*/

import React, { Component } from 'react';
import '../styles/Toolbar.css';
import Slider from './Slider.js';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeSliderProps: {
                currentValue: 10,
                max: 100,
                min: 2,
                step: 5
            },
            sparsitySliderProps: {
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
                    sliderProps={this.state.nodeSliderProps}
                />
                <Slider
                    label="Sparsity"
                    sliderProps={this.state.sparsitySliderProps}
                    isPerc={true}
                />
            </div>
        )
    }
}