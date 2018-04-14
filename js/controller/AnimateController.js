/**
 * Animation controller component
 */

import React, { Component } from "react";
import { Dimensions } from "react-native";
import Svg, { Ellipse, G, Polygon } from "react-native-svg";
import Balloon from "../shapes/Balloon";
import Sky from "../shapes/Sky";
import BurstAnimation from "../animation/BurstAnimation";
import ColorTextAnimation from "../animation/ColorTextAnimation";

const BALLOON_NUMBER = 10;
const SIDE_MARGIN = 15;
const MAX_ROTATE_DEGREE = 15;
const COLORS = ["red", "yellow", "green", "orange", "gray", "blue"];
const COLORS_TEXT = ["KIRMIZI", "SARI", "YEŞİL", "TURUNCU", "GRİ", "MAVİ"];

export default class AnimateController extends Component<{}> {
  animateSpeed = 1.0;
  balloonDensity = 1.0;
  balloonElements = [];
  balloonsCyPos = [];
  balloonsCxPos = [];
  balloonsRotateDegree = [];
  balloonsRotateSign = [];
  balloonsColorIndex = [];
  balloonNumber = BALLOON_NUMBER;
  burstCx = 0.0;
  burstCy = 0.0;
  burstColor = COLORS[0];
  burstStart = false;
  selectedColor = 0;

  constructor(props) {
    super(props);
    this.state = {
      yOffset: 0.0,
      rotateOffset: 0.0
    };
    this.animate = this.animate.bind(this);
    this.onBalloonPress = this.onBalloonPress.bind(this);
    this.burstFinish = this.burstFinish.bind(this);
    //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for (var i = 0; i < BALLOON_NUMBER; i++) {
      this.balloonsCxPos[i] = 0.0;
      this.balloonsCyPos[i] = 0.0;
      this.balloonsRotateDegree[i] = 0.0;
      this.balloonsRotateSign[i] = 1;
      this.balloonsColorIndex[i] = 0;
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
    this.burstWidth = 2 * this.rx;
  }

  calculateRenderSizes() {
    this.newBalloonYThreshold =
      this.startCy - this.startCy / this.balloonDensity - this.ry;
    this.balloonNumber = BALLOON_NUMBER * this.balloonDensity;
  }

  generateNewBalloonIndex(recursionCount) {
    let newBalloonIndex = 0;

    newBalloonIndex = parseInt(Math.random() * BALLOON_NUMBER, 10);
    if (this.balloonsCyPos[newBalloonIndex] <= this.newBalloonYThreshold) {
      return newBalloonIndex;
    } else if (recursionCount < 2 * BALLOON_NUMBER) {
      return this.generateNewBalloonIndex(++recursionCount);
    } else {
      return -1;
    }
  }

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomBetweenExcept(min, max, exceptNumber) {
    let randomNumber = Math.floor(Math.random() * (max - min) + min);

    if (randomNumber == exceptNumber) {
      if (exceptNumber == max) {
        randomNumber--;
      } else {
        randomNumber++;
      }
    }
    return randomNumber;
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
      let newBalloonIndex = balloonNumberInTheScreen;
      if (animateBegin) newBalloonIndex = this.generateNewBalloonIndex();
      if (newBalloonIndex != -1) {
        this.balloonsCyPos[newBalloonIndex] =
          Math.random() * 4 * this.ry + this.startCy;
        this.balloonsCxPos[newBalloonIndex] =
          Math.random() * SIDE_MARGIN +
          newBalloonIndex * (2 * this.rx) +
          this.rx;
        this.balloonsRotateDegree[newBalloonIndex] =
          Math.random() * MAX_ROTATE_DEGREE - MAX_ROTATE_DEGREE / 2;
        this.balloonsRotateSign[newBalloonIndex] = Math.sign(
          this.balloonsRotateDegree[newBalloonIndex]
        );
        let previousBalloonIndex =
          newBalloonIndex == 0 ? 0 : newBalloonIndex - 1;
        this.balloonsColorIndex[newBalloonIndex] = this.randomBetweenExcept(
          0,
          COLORS.length - 1,
          this.balloonsColorIndex[previousBalloonIndex]
        );
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
        color: COLORS[this.balloonsColorIndex[i]],
        rotateDegree: this.balloonsRotateDegree[i],
        key: i
      };
    }
  }

  onBalloonPress(balloonIndex) {
    if (this.balloonsColorIndex[balloonIndex] == this.selectedColor) {
      this.burstCx = this.balloonsCxPos[balloonIndex];
      this.burstCy = this.balloonsCyPos[balloonIndex];
      this.burstColor = COLORS[this.balloonsColorIndex[balloonIndex]];
      this.burstStart = true;
      this.balloonsCyPos[balloonIndex] = -1.1 * this.ry;
      this.selectedColor = this.randomBetweenExcept(
        0,
        COLORS.length - 1,
        this.selectedColor
      );
      console.log("BALLOON PRESSED!!!");
    }
  }

  burstFinish() {
    // this.burstCx = 0.0;
    // this.burstCy = 0.0;
    // this.burstColor = COLORS[0];
    this.burstStart = false;
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
        <BurstAnimation
          cx={this.burstCx}
          cy={this.burstCy}
          color={this.burstColor}
          burstStart={this.burstStart}
          animateSpeed={this.animateSpeed}
          burstWidth={this.burstWidth}
          burstFinish={this.burstFinish}
        />
        <ColorTextAnimation
          cx={0}
          cy={0}
          color={COLORS[this.selectedColor]}
          colorText={COLORS_TEXT[this.selectedColor]}
          animateSpeed={this.animateSpeed}
          fontSize={this.burstWidth}
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
              index={balloon.key}
              onPress={this.onBalloonPress}
            />
          );
        })}
      </Svg>
    );
  }
}
