/**
* SVG Shape Components
*/

import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Ellipse, G, Polygon } from "react-native-svg";
import * as Common from "../common";

export default class Balloon extends Component<{}> {
  static propTypes = {
    cx: Common.numberProp.isRequired,
    cy: Common.numberProp.isRequired,
    rx: Common.numberProp.isRequired,
    ry: Common.numberProp.isRequired,
    color: Common.numberProp.isRequired
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  /*componentDidMount() {
    // this.updateWindowDimensions();
    // window.addEventListener("resize", this.updateWindowDimensions);
    this.animateTimer = setInterval(() => this.animate(), 30);
  }

  componentWillMount() {
    this.updateWindowDimensions();
    this.calculateInitialRenderSizes();
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateWindowDimensions);
    clearInterval(this.animateTimer);
  }

  updateWindowDimensions() {
    this.screenWidth = Dimensions.get("window").width;
    this.screenHeight = Dimensions.get("window").height;
  }

  animate() {
    let yOffset = this.props.animateSpeed * 2.0;
    let newCyPos = this.state.cy - yOffset;
    let rotateDegree =
      this.state.rotateDegree + this.rotateSign * this.props.animateSpeed * 1.0;
    if (parseInt(Math.abs(rotateDegree), 10) > MAX_ROTATE_DEGREE) {
      this.rotateSign = this.rotateSign * -1;
    }
    this.setState({ cy: newCyPos, rotateDegree: rotateDegree });
    this.prop.onUpdate();
  }

  calculateInitialRenderSizes() {
    this.startCy = this.screenHeight + this.props.ry;
  }*/
  onPress() {
    this.props.onPress(this.props.index);
  }

  render() {
    let floatProps = Object.values(this.props).map(value => parseFloat(value));
    let polygonPoints = `${floatProps[0]}, ${floatProps[1] +
      floatProps[3]} ${floatProps[0] - floatProps[2] / 6}, ${floatProps[1] +
      1.1 * floatProps[3]} ${floatProps[0] +
      floatProps[2] / 6}, ${floatProps[1] + 1.1 * floatProps[3]}`;
    return (
      <G
        transform={
          "rotate(" +
          this.props.rotateDegree +
          " " +
          this.props.cx +
          " " +
          this.props.cy +
          ")"
        }
      >
        <Ellipse
          cx={this.props.cx}
          cy={this.props.cy}
          rx={this.props.rx}
          ry={this.props.ry}
          fill={this.props.color}
          fillOpacity="0.8"
          onPress={this.onPress}
        />
        <Polygon points={polygonPoints} fill={this.props.color} />
      </G>
    );
  }
}
