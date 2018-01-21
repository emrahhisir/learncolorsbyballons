/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Circle,
  Rect,
  G,
  Path,
  Polygon
} from "react-native-svg";
import Balloon from "./js/shapes/Balloon";
import Sky from "./js/shapes/Sky";

export default class MainComponent extends Component<{}> {
  static title = "Define an ellipse with a horizontal linear gradient from yellow to red";
  render() {
    return (
      <Svg height="1000" width="1000" fill="red">
        <Sky
          width={Dimensions.get("window").width}
          height={Dimensions.get("window").height}
          cloudWidth="0"
          cloudHeight="0"
          skyColor="#80c6e6"
          cloudColor="#ffffff"
        />
        <Balloon cx="100" cy="300" rx="60" ry="85" color="red" />
        <Balloon cx="200" cy="350" rx="60" ry="85" color="green" />
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
