/**
 * Animation controller component
 */

import React, { Component } from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Slider,
  Keyboard
} from "react-native";
import Svg, { Ellipse, G, Polygon, Circle } from "react-native-svg";
import PopupDialog, {
  SlideAnimation,
  DialogTitle,
  DialogButton
} from "react-native-popup-dialog";
import Sound from "react-native-sound";
import Balloon from "../shapes/Balloon";
import Sky from "../shapes/Sky";
import BurstAnimation from "../animation/BurstAnimation";
import ColorTextAnimation from "../animation/ColorTextAnimation";
import * as Common from "../common";
import AdsController from "../controller/AdsController";

const BALLOON_NUMBER = 8;
const SIDE_MARGIN = 15;
const MAX_ROTATE_DEGREE = 15;
const ADS_SHOW_THRESHOLD = 5;
const COLORS = [
  "red",
  "yellow",
  "green",
  "blue",
  "black",
  "orange",
  "rgb(230, 190, 210)",
  "purple"
];
const COLORS_TEXT = [
  "KIRMIZI",
  "SARI",
  "YEŞİL",
  "MAVİ",
  "SİYAH",
  "TURUNCU",
  "PEMBE",
  "MOR"
];
const COLOR_SOUND = [
  "red.mp3",
  "yellow.mp3",
  "green.mp3",
  "blue.mp3",
  "black.mp3",
  "orange.mp3",
  "pink.mp3",
  "purple.mp3"
];

const slideMenuAnimation = new SlideAnimation({
  slideFrom: "top"
});
export default class AnimateController extends Component<{}> {
  animateSpeed = 2.0;
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
  selectedColor = 2;
  firstMenuCompleted = false;
  secondMenuShowing = false;
  colorsInScreen = [];
  colorsInScreenRunCounter = 0;
  balloonBurstCounter = 0;
  showAd = false;
  sounds = { wrongAnswerSound: {}, colorSound: {}, backgroundSound: {} };
  testCounter = 0;

  constructor(props) {
    super(props);
    this.state = {
      yOffset: 0.0,
      rotateOffset: 0.0
    };
    this.animate = this.animate.bind(this);
    this.onBalloonPress = this.onBalloonPress.bind(this);
    this.burstFinish = this.burstFinish.bind(this);
    this.onMenuPress = this.onMenuPress.bind(this);
    this.onMenuDismissed = this.onMenuDismissed.bind(this);
    this.onMenuResultPress = this.onMenuResultPress.bind(this);
    this.showSettignsMenu = this.showSettignsMenu.bind(this);
    this.adOpened = this.adOpened.bind(this);
    this.adClosed = this.adClosed.bind(this);
    //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for (var i = 0; i < BALLOON_NUMBER; i++) {
      this.balloonsCxPos[i] = 0.0;
      this.balloonsCyPos[i] = 0.0;
      this.balloonsRotateDegree[i] = 0.0;
      this.balloonsRotateSign[i] = 1;
      this.balloonsColorIndex[i] = 0;
    }
  }

  initializeSound(soundProp, bundleName) {
    this.sounds[soundProp] = new Sound(
      bundleName,
      Sound.MAIN_BUNDLE,
      function(error) {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
      }.bind(this)
    );

    // Reduce the volume by half
    this.sounds[soundProp].setVolume(0.5);
    // console.log("Volume after setVolume: " + this.wrongAnswerSound.getVolume());

    // Position the sound to the full right in a stereo field
    this.sounds[soundProp].setPan(1);
  }

  componentDidMount() {
    // this.updateWindowDimensions();
    // window.addEventListener("resize", this.updateWindowDimensions);
    this.randomNumber1 = this.randomBetween(5, 40);
    this.randomNumber2 = this.randomBetween(5, 40);
    this.initializeSound("wrongAnswerSound", "wrong_answer.mp3");
    this.initializeSound("colorSound", COLOR_SOUND[this.selectedColor]);
    this.initializeSound("backgroundSound", "backgroundMusic.mp3");
    this.resume();
  }

  componentWillMount() {
    this.updateWindowDimensions();
    this.calculateInitialRenderSizes();
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateWindowDimensions);
    clearInterval(this.animateTimer);
    this.sounds.wrongAnswerSound.release();
    this.sounds.colorSound.release();
    this.sounds.backgroundSound.release();
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

  playSound(soundProp) {
    this.sounds[soundProp].play(
      function(success) {
        if (success) {
          // console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          this.sounds[soundProp].reset();
        }
      }.bind(this)
    );
  }

  pause() {
    clearInterval(this.animateTimer);
    this.sounds.backgroundSound.pause();
  }

  resume() {
    this.animateTimer = setInterval(() => this.animate(), Common.LCBB_FPS_MS);
    this.playSound("backgroundSound");
  }

  calculateInitialRenderSizes() {
    this.rx = (this.screenWidth - 2 * SIDE_MARGIN) / BALLOON_NUMBER / 2;
    this.ry = this.rx * 1.4;
    this.startCy = this.screenHeight + this.ry;
    this.burstWidth = this.rx;
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

  randomIn(values) {
    const max = values.length - 1;
    return values[Math.floor(Math.random() * max)];
  }

  randomInExcept(values, exceptNumber) {
    const max = values.length - 1;
    let randomNumber = Math.floor(Math.random() * max);
    let returnValue = values[randomNumber];

    if (returnValue == exceptNumber) {
      if (randomNumber == max) {
        returnValue = values[randomNumber - 1];
      } else {
        returnValue = values[randomNumber + 1];
      }

      if (returnValue == exceptNumber) {
        return this.randomInExcept(values, exceptNumber);
      }
    }
    return returnValue;
  }

  randomBetweenExcept(min, max, exceptNumber1, exceptNumber2) {
    let randomNumber = Math.floor(Math.random() * (max - min) + min);

    if (randomNumber == exceptNumber1 || randomNumber == exceptNumber2) {
      return this.randomBetweenExcept(min, max, exceptNumber1, exceptNumber2);
    }
    return randomNumber;
  }

  generateBalloonsPos() {
    let balloonNumberInTheScreen = 0;
    let animateBegin = this.state.yOffset > 0.0;
    let colorsInScreenRun = false;

    this.colorsInScreenRunCounter++;
    if (this.colorsInScreenRunCounter % 25 == 0) {
      colorsInScreenRun = true;
      this.colorsInScreen = [];
      this.colorsInScreenRunCounter = 0;
      this.playSound("backgroundSound");
    }

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
        if (
          this.balloonsCyPos[i] < this.screenHeight &&
          this.balloonsCyPos[i] > this.newBalloonYThreshold
        ) {
          this.colorsInScreen.push(this.balloonsColorIndex[i]);
        }
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
          newBalloonIndex == 0 ? 1 : newBalloonIndex - 1;
        let nextBalloonIndex =
          newBalloonIndex == BALLOON_NUMBER - 1
            ? BALLOON_NUMBER - 1
            : newBalloonIndex + 1;
        this.balloonsColorIndex[newBalloonIndex] = this.randomBetweenExcept(
          0,
          COLORS.length - 1,
          this.balloonsColorIndex[previousBalloonIndex],
          this.balloonsColorIndex[nextBalloonIndex]
        );
      }
      balloonNumberInTheScreen++;
    }
  }

  renderBalloons() {
    this.calculateRenderSizes();
    this.generateBalloonsPos();
    this.testCounter++;

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

    if (this.testCounter > 100) {
      this.testCounter = 0;
      this.selectedColor = this.randomInExcept(
        this.colorsInScreen,
        this.selectedColor
      );
      this.onBalloonPress(0);
    }
  }

  onBalloonPress(balloonIndex) {
    if (/*this.balloonsColorIndex[balloonIndex] == this.selectedColor*/ true) {
      this.burstCx = this.balloonsCxPos[balloonIndex];
      this.burstCy = this.balloonsCyPos[balloonIndex];
      this.burstColor = COLORS[this.balloonsColorIndex[balloonIndex]];
      this.burstStart = true;
      this.balloonsCyPos[balloonIndex] = -1.1 * this.ry;
      /*this.selectedColor = this.randomInExcept(
        this.colorsInScreen,
        this.selectedColor
      );*/
      //this.playColorSound();
      this.balloonBurstCounter++;
    } else {
      this.sounds.wrongAnswerSound.play(
        function(success) {
          if (success) {
            // console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            this.sounds.wrongAnswerSound.reset();
          }
        }.bind(this)
      );
    }
  }

  playColorSound() {
    this.sounds.colorSound.play(
      function(success) {
        if (success) {
          // console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          this.sounds.colorSound.reset();
        }
      }.bind(this)
    );

    this.sounds.colorSound = new Sound(
      COLOR_SOUND[this.selectedColor],
      Sound.MAIN_BUNDLE,
      function(error) {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
      }.bind(this)
    );
  }

  onMenuPress() {
    this.pause();
    this.menuDialog.show();
  }

  onMenuDismissed() {
    if (this.firstMenuCompleted) {
      this.menuTextInput = "";
      this.menuTextInputObj.clear();
      this.randomNumber1 = this.randomBetween(5, 40);
      this.randomNumber2 = this.randomBetween(5, 40);
      setTimeout(this.showSettignsMenu, 500);
      this.animate();
    } else {
      this.secondMenuShowing = false;
      this.resume();
    }

    Keyboard.dismiss();
  }

  onMenuResultPress() {
    if (
      this.firstMenuCompleted == false &&
      this.randomNumber1 + this.randomNumber2 == parseInt(this.menuTextInput)
    ) {
      this.firstMenuCompleted = true;
      this.menuDialog.dismiss();
    } else if (this.secondMenuShowing) {
      this.menuDialog.dismiss();
    }
  }

  showSettignsMenu() {
    this.menuDialog.show();
    this.firstMenuCompleted = false;
    this.secondMenuShowing = true;
  }

  onMenuTextInputChanged(text) {
    this.menuTextInput = text;
    if (this.menuTextInput.length == 2) {
      Keyboard.dismiss();
    }
  }

  renderSettingsMenuComponent() {
    if (this.firstMenuCompleted) {
      return (
        <View style={styles.popupMenu}>
          <Text style={styles.sumText}>Hız:</Text>
          <Slider
            minimumValue={1}
            maximumValue={3}
            style={styles.speedSlider}
            onValueChange={value => {
              this.animateSpeed = value;
            }}
            value={this.animateSpeed}
            step={1}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.popupMenu}>
          <Text style={styles.sumText}>
            {this.randomNumber1} + {this.randomNumber2} =
          </Text>
          <TextInput
            style={styles.menuTextInput}
            keyboardType="numeric"
            onChangeText={text => this.onMenuTextInputChanged(text)}
            ref={textInput => {
              this.menuTextInputObj = textInput;
            }}
          />
        </View>
      );
    }
  }

  burstFinish() {
    this.burstStart = false;
  }

  adOpened() {
    this.pause();
  }

  adClosed() {
    this.balloonBurstCounter = 0;
    this.showAd = false;
    this.resume();
  }

  render() {
    if (this.balloonBurstCounter >= ADS_SHOW_THRESHOLD) {
      this.showAd = true;
    }
    this.renderBalloons();
    return (
      <View height={this.screenHeight} width={this.screenWidth}>
        <AdsController
          adOpened={this.adOpened}
          adClosed={this.adClosed}
          showAd={this.showAd}
        />
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
        <TouchableWithoutFeedback onPress={this.onMenuPress}>
          <Image
            style={styles.button}
            source={require("../rsc/image/menu32x.png")}
          />
        </TouchableWithoutFeedback>
        <PopupDialog
          dialogTitle={<DialogTitle title="Ayarlar" />}
          width={0.5}
          height={0.5}
          dialogStyle={{ top: 0 }}
          onDismissed={this.onMenuDismissed}
          ref={popupDialog => {
            this.menuDialog = popupDialog;
          }}
          dialogAnimation={slideMenuAnimation}
          actions={[
            <DialogButton
              text="TAMAM"
              align="center"
              onPress={this.onMenuResultPress}
              key="0"
            />
          ]}
        >
          {this.renderSettingsMenuComponent()}
        </PopupDialog>
        <ColorTextAnimation
          color={COLORS[this.selectedColor]}
          colorText={COLORS_TEXT[this.selectedColor]}
          animateSpeed={this.animateSpeed}
          fontSize={this.burstWidth}
        />
      </View>
    );
  }

  /*render() {
    return this.renderConditional();
  }*/
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    marginTop: 10,
    left: 10
  },
  popupMenu: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  sumText: {
    fontSize: 32
  },
  menuTextInput: {
    height: 50,
    width: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    fontSize: 28
  },
  speedSlider: {
    marginLeft: 10,
    width: 100
  },
  dialogStye: {
    marginTop: 0
  }
});
