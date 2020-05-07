import React, { Component } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import '../styles/Slider.css';

export default class Slider extends Component {

    constructor(props) {
        super(props);
        this.label = props.label;

        if (props.isPerc) {
            this.labelHandler = this.tooltipLabelPerc;
        } else {
            this.labelHandler = this.tooltipLabelNumber;
        }

        this.state = {
            sliderProps: props.sliderProps
        };
        this.changeSliderValue.bind(this);
    }

    tooltipLabelPerc(crtValue) {
        return crtValue + "%";
    }

    tooltipLabelNumber(crtValue) {
        return crtValue;
    }

    changeSliderValue(changeEvent) {
        // Need to do this conversion since otherwise an error is sometimes thrown
        let newSliderValue = Number(changeEvent.target.value);
        this.setState({
            sliderProps: {
                currentValue: newSliderValue
            }
        });
    }

    render() {
        return (
            <div className="SliderParentDiv">
                <div className="LabelChildDiv">
                    {this.label}
                </div>
                <div className="SliderChildDiv">
                    <RangeSlider
                        value={this.state.sliderProps.currentValue}
                        min={this.state.sliderProps.min}
                        max={this.state.sliderProps.max}
                        onChange={eventChange => this.changeSliderValue(eventChange)}
                        tooltip="on"
                        tooltipLabel={this.labelHandler}
                    />
                </div>
            </div>
        )
    }
}