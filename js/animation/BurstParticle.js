import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Use } from "react-native-svg";
import Transition from "react-transition-group/Transition";
import { TimelineMax, TweenLite } from "gsap";
import "gsap-react-plugin";

const duration = 5000;

const defaultStyle = {
  opacity: 0,
  transform: "translate(300px, 0)"
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

export default class BurstParticle extends Component<{}> {
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

  static tl = new TimelineMax({
    repeat: 0
  });

  constructor(props) {
    super(props);
    this.state = {
      scale: props.scale,
      x: 0,
      y: 0,
      alpha: 0,
      rotation: 0
    };
  }

  getTween(property, finalValue, duration, options) {
    if (!options) {
      options = {};
    }
    var finalState = {};
    finalState[property] = finalValue;
    return TweenMax.to(
      this,
      duration,
      Object.assign({}, { state: finalState }, options)
    );
  }

  componentDidMount() {
    /*TweenMax.set(this.particle, {
      scale: 0,
      transformOrigin: "50% 50%"
    });
    TweenMax.set(this.particle, {
      transformOrigin: "50% 50%",
      y: -40
    });*/
    this._createExplosion();
  }

  _createExplosion(n, done) {
    //console.log(n);
    if (this.myDataObj.duration < 0.5) {
      this.myDataObj.duration = 0.5;
    }

    if (this.props.index == 0) {
      BurstParticle.tl.clear();
    }

    TweenMax.set(this, {
      scale: this.props.scale,
      x: 310,
      y: 220,
      alpha: this.myDataObj.alpha
    });
    let t = this.getTween(
      "rotation",
      this._randomBetween(0, this.myDataObj.rotationMax),
      1,
      {
        physics2D: {
          velocity: this._randomBetween(
            this.myDataObj.velocity / 2,
            this.myDataObj.velocity
          ),
          angle: this._randomBetween(-110, -80),
          gravity: this.props.weight * this.myDataObj.gravity
        },
        //alpha: 0,
        //rotation: this._randomBetween(0, this.myDataObj.rotationMax),
        skewX: this._randomBetween(0, this.myDataObj.skewx),
        skewY: this._randomBetween(0, this.myDataObj.skewy),
        //scale:0.5,
        //ease: Expo.easeOut,
        ease: Sine.easeInOut,
        //ease:SlowMo.ease.config(0., 1, false),
        onComplete: function(p) {
          TweenMax.set(p, {
            x: -20,
            y: -20
          });
        },
        onCompleteParams: [this]
      }
    );
    /*let t = TweenMax.to(n, this._randomBetween(0.1, this.myDataObj.duration), {
      physics2D: {
        velocity: this._randomBetween(
          this.myDataObj.velocity / 2,
          this.myDataObj.velocity
        ),
        angle: this._randomBetween(-110, -80),
        gravity: this.props.weight * this.myDataObj.gravity
      },
      //alpha: 0,
      rotation: this._randomBetween(0, this.myDataObj.rotationMax),
      skewX: this._randomBetween(0, this.myDataObj.skewx),
      skewY: this._randomBetween(0, this.myDataObj.skewy),
      //scale:0.5,
      //ease: Expo.easeOut,
      ease: Sine.easeInOut,
      //ease:SlowMo.ease.config(0., 1, false),
      onComplete: function(p) {
        TweenMax.set(p, {
          x: -20,
          y: -20
        });
      },
      onCompleteParams: [n]
    });*/

    BurstParticle.tl.add(t);

    /*if (this.props.index == this.myDataObj.particles - 1) {
      BurstParticle.tl.timeScale(this.myDataObj.time);
    }*/
  }

  _randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /*render() {
    return (
      <Transition
        in={this.props.beginExplosion}
        appear={true}
        timeout={duration}
        addEndListener={(n, done) => {
          //console.log(n);
          //console.log("beginExplosion: " + n.props.href);
          if (this.props.beginExplosion) {
            this._createExplosion(this.particle, done);
          } else {
            TweenMax.set(n, {
              scale: 0,
              transformOrigin: "50% 50%",
              y: -40
            });
          }
        }}
      >
        {state => (
          <Use
            href={this.props.type}
            fill={this.props.color}
            stroke="#FFF"
            scale={this.props.scale}
            weight={this.props.weight}
            ref={ref => (this.particle = ref)}
          />
        )}
      </Transition>
    );
  }*/
  /*render() {
    return (
      <Transition
        in={this.props.beginExplosion}
        timeout={duration}
        mountOnEnter={true}
        unmountOnExit={true}
        addEndListener={(n, done) => {
          if (this.props.in) {
            TweenLite.to(n, 1, {
              autoAlpha: 1,
              x: 0,
              ease: Back.easeOut,
              onComplete: done
            });
          } else {
            TweenLite.to(n, 1, { autoAlpha: 0, x: -100, onComplete: done });
          }
        }}
      >
        {state => (
          <div className="card" style={{ marginTop: "10px", ...defaultStyle }}>
            <div className="card-block">
              <h1 className="text-center">FADE IN/OUT COMPONENT</h1>
            </div>
          </div>
        )}
      </Transition>
    );
  }*/
  render() {
    /*if (this.props.beginExplosion) {
      this._createExplosion();
    }*/
    return (
      <Use
        x="200"
        y="200"
        href={this.props.type}
        fill={this.props.color}
        stroke="#FFF"
        scale={this.props.scale}
        weight={this.props.weight}
        ref={ref => (this.particle = ref)}
      />
    );
  }
}
