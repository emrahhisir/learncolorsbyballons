/**
* SVG Shape Components
*/

import React, { Component } from "react";
import { G, Path } from "react-native-svg";
import PropTypes from "prop-types";
import * as Common from "../common";

export default class Sky extends Component<{}> {
  clouds = [];
  skyPathPoints;
  cloudNumber = 5;

  static propTypes = {
    width: Common.numberProp.isRequired,
    height: Common.numberProp.isRequired,
    skyColor: Common.numberProp.isRequired,
    cloudColor: Common.numberProp.isRequired
  };

  constructor(props) {
    super(props);
    let xOffset = 200,
      yOffset = 0;
    let ySign = -1;
    let dString = "";
    let d = [
      "M",
      "79.72",
      "49.60",
      "C",
      "86.00",
      "37.29",
      "98.57",
      "29.01",
      "111.96",
      "26.42",
      "C",
      "124.27",
      "24.11",
      "137.53",
      "26.15",
      "148.18",
      "32.90",
      "C",
      "158.08",
      "38.78",
      "165.39",
      "48.87",
      "167.65",
      "60.20",
      "C",
      "176.20",
      "57.90",
      "185.14",
      "56.01",
      "194.00",
      "57.73",
      "C",
      "206.08",
      "59.59",
      "217.92",
      "66.01",
      "224.37",
      "76.66",
      "C",
      "227.51",
      "81.54",
      "228.85",
      "87.33",
      "229.23",
      "93.06",
      "C",
      "237.59",
      "93.33",
      "246.22",
      "95.10",
      "253.04",
      "100.19",
      "C",
      "256.69",
      "103.13",
      "259.87",
      "107.67",
      "258.91",
      "112.59",
      "C",
      "257.95",
      "118.43",
      "252.78",
      "122.38",
      "247.78",
      "124.82",
      "C",
      "235.27",
      "130.43",
      "220.23",
      "130.09",
      "207.98",
      "123.93",
      "C",
      "199.33",
      "127.88",
      "189.76",
      "129.43",
      "180.30",
      "128.57",
      "C",
      "173.70",
      "139.92",
      "161.70",
      "147.65",
      "148.86",
      "149.93",
      "C",
      "133.10",
      "153.26",
      "116.06",
      "148.15",
      "104.42",
      "137.08",
      "C",
      "92.98",
      "143.04",
      "78.96",
      "143.87",
      "66.97",
      "139.04",
      "C",
      "57.75",
      "135.41",
      "49.70",
      "128.00",
      "46.60",
      "118.43",
      "C",
      "43.87",
      "109.95",
      "45.81",
      "100.29",
      "51.30",
      "93.32",
      "C",
      "57.38",
      "85.18",
      "67.10",
      "80.44",
      "76.99",
      "78.89",
      "C",
      "74.38",
      "69.20",
      "74.87",
      "58.52",
      "79.72",
      "49.60",
      "Z"
    ];
    dString = d.join(" ");
    this.clouds.push(<Path key="0" fill={this.props.cloudColor} d={dString} />);
    for (var i = 1; i < this.cloudNumber; i++) {
      yOffset = -ySign * i * Math.floor(Math.random() * 50);
      ySign *= -1;
      d[1] = `${parseFloat(d[1]) + xOffset}`;
      d[2] = `${parseFloat(d[2]) + yOffset}`;
      for (var j = 4; j < d.length; j = j + 7) {
        d[j] = `${parseFloat(d[j]) + xOffset}`;
        d[j + 2] = `${parseFloat(d[j + 2]) + xOffset}`;
        d[j + 4] = `${parseFloat(d[j + 4]) + xOffset}`;
        d[j + 1] = `${parseFloat(d[j + 1]) + yOffset}`;
        d[j + 3] = `${parseFloat(d[j + 3]) + yOffset}`;
        d[j + 5] = `${parseFloat(d[j + 5]) + yOffset}`;
      }
      dString = d.join(" ");
      this.clouds.push(
        <Path key={i} fill={this.props.cloudColor} d={dString} />
      );
    }

    let floatProps = Object.values(this.props).map(value => parseFloat(value));
    this.skyPathPoints = `M 0 0 L ${floatProps[0]} 0 L ${floatProps[0]} ${floatProps[1]} L 0 ${floatProps[1]} L 0 0 Z`;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <G>
        <Path fill={this.props.skyColor} d={this.skyPathPoints} />
        {this.clouds}
      </G>
    );
  }
}
