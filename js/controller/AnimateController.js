/**
* Animation controller component
*/

import React, { Component } from "react";
import { Dimensions } from "react-native";
import Svg, { Ellipse, G, Polygon } from "react-native-svg";
import Balloon from "../shapes/Balloon";
import Sky from "../shapes/Sky";

const BALLOON_NUMBER = 10;
const SIDE_MARGIN = 15;
const MAX_ROTATE_DEGREE = 15;
const COLORS = ["red", "yellow", "green", "orange", "gray", "blue"];

export default class AnimateController extends Component<{}> {
  animateSpeed = 1.0;
  balloonDensity = 1.0;
  balloonElements = [];
  balloonsCyPos = [];
  balloonsCxPos = [];
  balloonsRotateDegree = [];
  balloonsRotateSign = [];
  balloonsColor = [];
  balloonNumber = BALLOON_NUMBER;

  constructor(props) {
    super(props);
    this.state = {
      yOffset: 0.0,
      rotateOffset: 0.0
    };
    this.animate = this.animate.bind(this);
    //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for (var i = 0; i < BALLOON_NUMBER; i++) {
      this.balloonsCxPos[i] = 0.0;
      this.balloonsCyPos[i] = 0.0;
      this.balloonsRotateDegree[i] = 0.0;
      this.balloonsRotateSign[i] = 1;
      this.balloonsColor[i] = COLORS[0];
    }
  }

  componentDidMount() {
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
    let yOffset = this.animateSpeed * 2.0;
    let rotateOffset = this.animateSpeed * 1.0;
    this.setState({ yOffset: yOffset, rotateOffset: rotateOffset });
  }

  calculateInitialRenderSizes() {
    this.rx = (this.screenWidth - 2 * SIDE_MARGIN) / BALLOON_NUMBER / 2;
    this.ry = this.rx * 1.4;
    this.startCy = this.screenHeight + this.ry;
  }

  calculateRenderSizes() {
    this.newBalloonYThreshold =
      this.startCy - this.startCy / this.balloonDensity - this.ry;
    this.balloonNumber = BALLOON_NUMBER * this.balloonDensity;
  }

  generateNewBalloonIndex(recursionCount) {
    let newBallooonIndex = 0;

    newBallooonIndex = parseInt(Math.random() * BALLOON_NUMBER, 10);
    if (this.balloonsCyPos[newBallooonIndex] <= this.newBalloonYThreshold) {
      return newBallooonIndex;
    } else if (recursionCount < 2 * BALLOON_NUMBER) {
      return this.generateNewBalloonIndex(++recursionCount);
    } else {
      return -1;
    }
  }

  generateBalloonsPos() {
    let balloonNumberInTheScreen = 0;
    let animateBegin = this.state.yOffset > 0.0;

    for (var i = 0; i < this.balloonNumber && animateBegin; i++) {
      this.balloonsCyPos[i] -= this.state.yOffset;
      this.balloonsRotateDegree[i] +=
        this.balloonsRotateSign[i] * this.state.rotateOffset;
      if (
        parseInt(Math.abs(this.balloonsRotateDegree[i]), 10) > MAX_ROTATE_DEGREE
      ) {
        this.balloonsRotateSign[i] = this.balloonsRotateSign[i] * -1;
      }
      if (this.balloonsCyPos[i] > this.newBalloonYThreshold) {
        balloonNumberInTheScreen++;
      }
    }

    while (balloonNumberInTheScreen < this.balloonNumber) {
      let newBallooonIndex = balloonNumberInTheScreen;
      if (animateBegin) newBallooonIndex = this.generateNewBalloonIndex();
      if (newBallooonIndex != -1) {
        this.balloonsCyPos[newBallooonIndex] =
          Math.random() * 4 * this.ry + this.startCy;
        this.balloonsCxPos[newBallooonIndex] =
          Math.random() * SIDE_MARGIN +
          newBallooonIndex * (2 * this.rx) +
          this.rx;
        this.balloonsRotateDegree[newBallooonIndex] =
          Math.random() * MAX_ROTATE_DEGREE - MAX_ROTATE_DEGREE / 2;
        this.balloonsRotateSign[newBallooonIndex] = Math.sign(
          this.balloonsRotateDegree[newBallooonIndex]
        );
        this.balloonsColor[newBallooonIndex] =
          COLORS[parseInt(Math.random() * COLORS.length, 10)];
      }
      balloonNumberInTheScreen++;
    }
  }

  renderBalloons() {
    this.calculateRenderSizes();
    this.generateBalloonsPos();

    for (var i = 0; i < this.balloonNumber; i++) {
      this.balloonElements[i] = {
        cx: this.balloonsCxPos[i],
        cy: this.balloonsCyPos[i],
        rx: this.rx,
        ry: this.ry,
        color: this.balloonsColor[i],
        rotateDegree: this.balloonsRotateDegree[i],
        key: i
      };
    }
  }

  render() {
    this.renderBalloons();
    return (
      <Svg height={this.screenHeight} width={this.screenWidth}>
        <Sky
          width={this.screenWidth}
          height={this.screenHeight}
          cloudWidth="0"
          cloudHeight="0"
          skyColor="#80c6e6"
          cloudColor="#ffffff"
        />
        {this.balloonElements.map(balloon => {
          return (
            <Balloon
              cx={balloon.cx}
              cy={balloon.cy}
              rx={balloon.rx}
              ry={balloon.ry}
              color={balloon.color}
              rotateDegree={balloon.rotateDegree}
              key={balloon.key}
            />
          );
        })}
      </Svg>
    );
  }
}
