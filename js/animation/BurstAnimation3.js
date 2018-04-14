import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Svg, Defs, Path, G, Polygon, Use } from "react-native-svg";
import PropTypes from "prop-types";
//import { TimelineMax, TweenMax } from "gsap";
import BurstParticle from "./BurstParticle";
import * as Common from "../common";

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
	}

	componentDidMount() {
		switch (this.props.animateSpeed) {
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
		this._createParticlePool();
	}

	componentWillUnmount() {
		clearInterval(this.animateTimer);
		this.props.burstFinish();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.burstStart != this.props.burstStart) {
			if (this.props.burstStart) {
				this.animateTimer = setInterval(
					() => this._animate(),
					Common.LCBB_FPS
				);
				setTimeout(
					() => this._stopAnimate(),
					this.animationDurationInMsec
				);

				for (var i = 0; i < MAX_PARTICLE_POOL; i++) {
					this.particles[i].cx = this.props.cx;
					this.particles[i].cy = this.props.cy;
				}

				this.setState({
					timeElapsedInMsec: 0.0
				});
			} else {
				this.props.burstFinish();
			}
		}
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
		return (
			<G>
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
				{this.particles.map(particle => {
					return (
						<Use
							href={particle.type}
							fill={this.props.color}
							fillOpacity="0.8"
							x={particle.cx}
							y={particle.cy}
							rotation={particle.rotation}
							scale={particle.scale}
							key={particle.key}
						/>
					);
				})}
			</G>
		);
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
