import React, { Component } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import '../styles/Slider.css';

export default class Slider extends Component {

    constructor(props) {
        super(props);
        this.label = props.label;
        this.notifyGraphRedraw = props.notifyGraphRedraw;
        this.max = props.sliderProps.max / props.sliderProps.step;
        this.min = props.sliderProps.min / props.sliderProps.step;
        this.um = props.um;

        this.state = {
            sliderProps: props.sliderProps
        };
        this.tooltipLabel = this.tooltipLabel.bind(this);
    }

    convertToRealValue(value) {
        return value * this.props.sliderProps.step;
    }

    tooltipLabel(crtValue) {
        return this.convertToRealValue(crtValue) + this.um;
    }

    changeSliderValue(changeEvent) {
        // Need to do this conversion since otherwise an error is sometimes thrown
        let newSliderValue = Number(changeEvent.target.value);
        this.setState({
            sliderProps: {
                currentValue: newSliderValue
            }
        });

        this.notifyGraphRedraw(this.label, this.convertToRealValue(newSliderValue));
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
                        min={this.min}
                        max={this.max}
                        step={this.state.sliderProps.step}
                        onChange={eventChange => this.changeSliderValue(eventChange)}
                        tooltip="on"
                        tooltipLabel={this.tooltipLabel}
                    />
                </div>
            </div>
        )
    }
}