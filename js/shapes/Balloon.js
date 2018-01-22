/**
* SVG Shape Components
*/

import React, { Component } from "react";
import Svg, { Ellipse, G, Polygon } from "react-native-svg";
import * as ShapesCommon from "./Common";

export default class Balloon extends Component<{}> {
  rotateDegree = 1.0;
  polygonPoints;

  static propTypes = {
    cx: ShapesCommon.numberProp.isRequired,
    cy: ShapesCommon.numberProp.isRequired,
    rx: ShapesCommon.numberProp.isRequired,
    ry: ShapesCommon.numberProp.isRequired,
    color: ShapesCommon.numberProp.isRequired
  };

  constructor(props) {
    super(props);

    let floatProps = Object.values(this.props).map(value => parseFloat(value));
    this.polygonPoints = `${floatProps[0]}, ${floatProps[1] +
      floatProps[3]} ${floatProps[0] - floatProps[2] / 6}, ${floatProps[1] +
      1.1 * floatProps[3]} ${floatProps[0] +
      floatProps[2] / 6}, ${floatProps[1] + 1.1 * floatProps[3]}`;
  }

  animate(speed) {
    this.props.cy += speed * 20.0;
    this.rotateDegree = Math.sign(this.rotateDegree) * speed * -10.0;
  }

  render() {
    this.animate(0.5);

    return (
      <G
        transform={
          "rotate(" +
          this.rotateDegree +
          " " +
          this.props.cx +
          " " +
          this.props.cy
        }
      >
        <Ellipse
          cx={this.props.cx}
          cy={this.props.cy}
          rx={this.props.rx}
          ry={this.props.ry}
          fill={this.props.color}
        />
        <Polygon points={this.polygonPoints} fill={this.props.color} />
      </G>
    );
  }
}
