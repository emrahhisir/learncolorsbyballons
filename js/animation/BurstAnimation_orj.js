import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Svg, Defs, Path, G, Polygon } from "react-native-svg";
//import { TimelineMax, TweenMax } from "gsap";
import BurstParticle from "./BurstParticle";

const MAX_PARTICLE_POOL = 200;

export default class BurstAnimation extends Component<{}> {
  xmlns = "http://www.w3.org/2000/svg";
  xlinkns = "http://www.w3.org/1999/xlink";
  particleArr = [];
  particleType = [
    { element: "#ring", weight: 1.8 },
    { element: "#star", weight: 2.1 },
    { element: "#diamond", weight: 1.7 },
    { element: "#ring", weight: 2.3 }
  ];
  particles = [];
  beginExplosion = false;

  myDataObj = {
    gravity: 60,
    gravityMax: 100,

    velocity: 230,
    velocityMax: 800,

    alpha: 1,
    alphaMax: 1,

    angle: 0,
    angleMax: 360,

    rotation: 720,
    rotationMax: 1000,

    particles: 20,
    particlesMax: 500,

    duration: 2.7,
    durationMax: 10,

    skewx: 0,
    skewxMax: 2280,

    skewy: 360,
    skewyMax: 2280,

    time: 3,
    timeMax: 4
  };
  /*tl = new TimelineMax({
    repeat: 0
  });*/

  constructor(props) {
    super(props);
    this.state = {
      cxOffset: 0,
      cyOffset: 0
    };
  }

  componentDidMount() {
    this._createParticlePool();
  }

  _createParticlePool() {
    var i = MAX_PARTICLE_POOL,
      p,
      tl;
    while (--i > -1) {
      let particleObj = this.particleType[
        this._randomBetween(0, this.particleType.length - 1)
      ];
      this.particles[i] = {
        type: particleObj.element,
        color: "red",
        weight: particleObj.weight,
        scale: this._randomBetween(3, 8) / 10,
        key: i
      };
    } //end while
  }

  _randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cx != this.props.cx || nextProps.cy != this.props.cy) {
      this.setState({
        cxOffset: nextProps.cx - this.props.cx,
        cyOffset: nextProps.cy - this.props.cy
      });
      //this.playExplosion();
      this.beginExplosion = true;
      console.log("BEGIN EXPLOSION");
    } else {
      this.beginExplosion = false;
    }
  }

  render() {
    return (
      <Svg height="400" width="400">
        <Defs>
          <Path
            id="paper"
            d="M8.871,18.001c-0.157,0-0.316-0.015-0.477-0.046c-2.064-0.398-3.886-1.318-5.268-2.661  C-0.197,12.067-0.94,6.663,1.231,1.527c0.538-1.271,2.004-1.866,3.276-1.329C5.78,0.736,6.374,2.203,5.837,3.474  c-1.342,3.173-1.031,6.481,0.772,8.233c0.692,0.672,1.611,1.123,2.732,1.339c1.355,0.261,2.243,1.572,1.981,2.928
  C11.092,17.17,10.044,18.001,8.871,18.001z"
          />
          <Path
            id="ring"
            d="M9.344,18.688C4.191,18.688,0,14.496,0,9.344S4.191,0,9.344,0s9.344,4.191,9.344,9.344
  S14.496,18.688,9.344,18.688z M9.344,3C5.846,3,3,5.846,3,9.344s2.846,6.344,6.344,6.344s6.344-2.846,6.344-6.344S12.842,3,9.344,3z
  "
          />
          <Polygon
            id="star"
            points="17.365,18.587 10.846,15.88 4.92,19.716 5.48,12.679 0,8.229 6.865,6.587 9.405,0 
  13.088,6.022 20.137,6.401 15.548,11.765 "
          />
          <Polygon
            id="diamond"
            points="6.444,17.442 0,8.721 6.444,0 12.888,8.721 "
          />
        </Defs>
        <G /*style={styles.container}*/>
          {this.particles.map(particle => {
            return (
              <BurstParticle
                type={particle.type}
                color={particle.color}
                weight={particle.weight}
                scale={particle.scale}
                beginExplosion={this.beginExplosion}
                index={particle.key}
                key={particle.key}
              />
            );
          })}
        </G>
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
  burstAnimation: {
    width: "100%",
    height: "100%"
  },
  container: {
    position: "absolute"
  }
});
