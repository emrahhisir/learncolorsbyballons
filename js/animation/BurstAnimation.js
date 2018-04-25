import React, { Component } from "react";
import {
	StyleSheet,
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	Vibration
} from "react-native";
import Art, { Surface, Group, Shape, Path } from "ReactNativeART";
import Sound from "react-native-sound";
import PropTypes from "prop-types";
import * as Common from "../common";

var AnimatedShape = Animated.createAnimatedComponent(Shape);
var { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

const VIBRATE_DURATION = 10000;
const VIBRATE_PATTERN = [0, 250, 150];

class AnimatedCircle extends Component<{}> {
	displayName = "Circle";

	render() {
		var radius = this.props.radius;
		var path = Path()
			.moveTo(0, -radius)
			.arc(0, radius * 2, radius)
			.arc(0, radius * -2, radius)
			.close();
		return <AnimatedShape {...this.props} d={path} />;
	}
}

export default class BurstAnimation extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {
			animation: new Animated.Value(0)
		};
		this._explode = this._explode.bind(this);
	}

	componentDidMount() {
		switch (this.props.animateSpeed) {
			case 1:
				this.animationDurationInMsec = 3000;
				break;
			case 2:
				this.animationDurationInMsec = 2000;
				break;
			case 3:
				this.animationDurationInMsec = 1000;
				break;
			default:
				this.animationDurationInMsec = 4000;
		}

		this.particleRadius = this.props.burstWidth / 2;
		Sound.setCategory("Playback");

		this.burstSound = new Sound(
			"balloon_burst_sound.mp3",
			Sound.MAIN_BUNDLE,
			function(error) {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				}
				// loaded successfully
				// console.log(
				// 	"duration in seconds: " +
				// 		this.burstSound.getDuration() +
				// 		"number of channels: " +
				// 		this.burstSound.getNumberOfChannels() +
				// 		" " +
				// 		this.burstSound.getVolume()
				// );
			}.bind(this)
		);

		// Reduce the volume by half
		this.burstSound.setVolume(0.5);
		// console.log("Volume after setVolume: " + this.burstSound.getVolume());

		// Position the sound to the full right in a stereo field
		this.burstSound.setPan(1);
	}

	componentWillUnmount() {
		clearInterval(this.animateTimer);
		this.props.burstFinish();
		this.burstSound.release();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.burstStart != this.props.burstStart) {
			if (nextProps.burstStart) {
				this.props.burstFinish();
				this.burstSound.stop(() => {
					// Note: If you want to play a sound after stopping and rewinding it,
					// it is important to call play() in a callback.
					this.burstSound.play();
				});
				this.state.animation.setValue(0);
				this.forceUpdate();
				this._explode();
				return true;
			}
		}

		return this.state.animation.Value != 0;
	}

	_explode() {
		Vibration.vibrate(VIBRATE_PATTERN);
		this.burstSound.play(
			function(success) {
				if (success) {
					// console.log("successfully finished playing");
				} else {
					console.log("playback failed due to audio decoding errors");
					// reset the player to its uninitialized state (android only)
					// this is the only option to recover after an error occured and use the player again
					this.burstSound.reset();
				}
			}.bind(this)
		);
		Animated.timing(this.state.animation, {
			duration: this.animationDurationInMsec,
			toValue: 28
		}).start(
			function() {
				this.state.animation.setValue(0);
				this.forceUpdate();
			}.bind(this)
		);
	}

	_getXYParticle(total, i, radius) {
		var angle = 2 * Math.PI / total * i;

		var x = Math.round(radius * 2 * Math.cos(angle - Math.PI / 2));
		var y = Math.round(radius * 2 * Math.sin(angle - Math.PI / 2));
		return {
			x: x,
			y: y
		};
	}

	_randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	_shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	_getSmallExplosions(radius, offset) {
		return [0, 1, 2, 3, 4, 5, 6].map(
			function(v, i, t) {
				var scaleOut = this.state.animation.interpolate({
					inputRange: [0, 5.99, 6, 13.99, 14, 21],
					outputRange: [0, 0, 1, 1, 1, 0],
					extrapolate: "clamp"
				});

				var moveUp = this.state.animation.interpolate({
					inputRange: [0, 5.99, 14],
					outputRange: [0, 0, -15],
					extrapolate: "clamp"
				});

				var moveDown = this.state.animation.interpolate({
					inputRange: [0, 5.99, 14],
					outputRange: [0, 0, 15],
					extrapolate: "clamp"
				});

				var position = this._getXYParticle(7, i, radius);

				return (
					<Group
						x={position.x + offset.x}
						y={position.y + offset.y}
						rotation={this._randomBetween(0, 40) * i}
						key={i}
					>
						<AnimatedCircle
							x={moveUp}
							y={moveUp}
							radius={15}
							scale={scaleOut}
							fill={this.props.color}
							key={10 * i + 1}
						/>
						<AnimatedCircle
							x={moveDown}
							y={moveDown}
							radius={8}
							scale={scaleOut}
							fill={this.props.color}
							key={20 * i + 2}
						/>
					</Group>
				);
			}.bind(this),
			this
		);
	}

	render() {
		var circle_scale = this.state.animation.interpolate({
			inputRange: [0, 0.99, 4],
			outputRange: [0, 0.6, 1],
			extrapolate: "clamp"
		});

		var circle_stroke_width = this.state.animation.interpolate({
			inputRange: [0, 0.99, 1, 3, 4],
			outputRange: [0, 13, 7, 5, 0],
			extrapolate: "clamp"
		});

		var circle_opacity = this.state.animation.interpolate({
			inputRange: [1, 3.99, 4],
			outputRange: [1, 1, 0],
			extrapolate: "clamp"
		});
		return (
			<Surface width={deviceWidth} height={deviceHeight}>
				<Group>
					<AnimatedCircle
						x={this.props.cx}
						y={this.props.cy}
						radius={this.props.burstWidth}
						scale={circle_scale}
						strokeWidth={circle_stroke_width}
						stroke={this.props.color}
						fill="rgba(0,0,0,0)"
						opacity={circle_opacity}
					/>
					{this._getSmallExplosions(this.particleRadius, {
						x: this.props.cx,
						y: this.props.cy
					})}
				</Group>
			</Surface>
		);
	}
}

BurstAnimation.propTypes = {
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
	burstStart: PropTypes.bool.isRequired,
	animateSpeed: PropTypes.number.isRequired,
	burstWidth: PropTypes.number.isRequired,
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
