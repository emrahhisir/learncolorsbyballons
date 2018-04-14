import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Defs, Path, G, Polygon, Use } from "react-native-svg";
import PropTypes from "prop-types";
//import { TimelineMax, TweenMax } from "gsap";
import BurstParticle from "./BurstParticle";
import * as Common from "../common";
import particleExplosions from "particle-explosions";
import Canvas from "react-native-canvas";

// Particle options
const options = {
	xPos: 100,
	yPos: 100,
	minSize: 5,
	maxSize: 30,
	minSpeed: 50,
	maxSpeed: 100,
	resistance: 0.85,
	gravity: 0.98,
	decay: 0.9,
	sizeToRemove: 0.1,
	color: "#000000"
};

const MAX_PARTICLE_POOL = 200;
const HALF_PARTICLE_POOL = MAX_PARTICLE_POOL / 2;

export default class BurstAnimation extends Component<{}> {
	particleType = [
		{ element: "#ring", weight: 1.8 },
		{ element: "#star", weight: 2.1 },
		{ element: "#diamond", weight: 1.7 },
		{ element: "#ring", weight: 2.3 }
	];
	particles = [];

	constructor(props) {
		super(props);
		this.state = { cxOffset: 0.0, cyOffset: 0.0 };

		this._animate = this._animate.bind(this);
		this.handleCanvas = this.handleCanvas.bind(this);
	}

	handleCanvas(canvas) {
		if (canvas) {
			this.canvas = canvas;
			this.ctx = this.canvas.getContext("2d");
			this.ctx.fillStyle = "purple";
			this.ctx.fillRect(0, 0, 100, 100);
		}
	}

	componentDidMount() {
		//this.ctx = canvas.getContext("2d");

		// Create new particle emitter
		this.emitter = new particleExplosions.Emitter(this.ctx);

		/*switch (this.props.animateSpeed) {
			case 1:
				this.animationDurationInMsec = 5000;
				break;
			case 2:
				this.animationDurationInMsec = 4000;
				break;
			case 3:
				this.animationDurationInMsec = 3000;
				break;
			default:
				this.animationDurationInMsec = 5000;
		}
		this._createParticlePool();*/
	}

	componentWillUnmount() {
		clearInterval(this.animateTimer);
		this.props.burstFinish();
	}

	loop() {
		if (this.emitter.isExploding) {
			//requestAnimationFrame(this.loop);
		}
		this.ctx.clearRect(0, 0, 100, 100);
		this.emitter.update();
	}

	componentDidUpdate(prevProps, prevState) {
		// Explode with 250 particles
		this.emitter.explode(250, options);

		// Draw to canvas in loop
		// ...or call emitter.update() in your existing loop
		this.loop();
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
				scale: this._randomBetween(3, 8) / 10,
				key: i,
				cx: this.props.cx,
				cy: this.props.cy,
				rotation: 0.0
			};
		} //end while
	}

	_randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	_animate() {
		if (
			this.state.timeElapsedInMsec <
			this.animationDurationInMsec / 10.0
		) {
			for (var i = 0; i < MAX_PARTICLE_POOL; i++) {
				let particleXOffset =
					this.props.xOffset / (8.0 * (i % HALF_PARTICLE_POOL));
				if (i < HALF_PARTICLE_POOL) {
					this.particles[i].cx -= particleXOffset;
				} else {
					this.particles[i].cx += particleXOffset;
				}
				this.particles[i].cy -= this.props.yOffset;
				this.particles[i].rotation += 2 * this.props.xOffset;
			}
		} else {
			for (var i = 0; i < MAX_PARTICLE_POOL; i++) {
				let particleXOffset =
					this.props.xOffset / (8.0 * (i % HALF_PARTICLE_POOL));
				if (i < HALF_PARTICLE_POOL) {
					this.particles[i].cx -= particleXOffset;
				} else {
					this.particles[i].cx += particleXOffset;
				}
				this.particles[i].cy += this.props.yOffset;
				this.particles[i].rotation += 2 * this.props.xOffset;
			}
		}

		this.setState({
			timeElapsedInMsec:
				1000.0 / Common.LCBB_FPS + this.state.timeElapsedInMsec
		});
	}

	_stopAnimate() {
		clearInterval(this.animateTimer);
		this.props.burstFinish();
	}

	render() {
		return <Canvas ref={this.handleCanvas} />;
	}
}

BurstAnimation.propTypes = {
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
	burstStart: PropTypes.bool.isRequired,
	animateSpeed: PropTypes.number.isRequired,
	xOffset: PropTypes.number.isRequired,
	yOffset: PropTypes.number.isRequired,
	burstFinish: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	burstAnimation: {
		width: "100%",
		height: "100%"
	},
	container: {
		position: "absolute"
	}
});
