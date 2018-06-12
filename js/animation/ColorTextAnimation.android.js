import React, { Component } from "react";
import { StyleSheet, Animated, View } from "react-native";
import Sound from "react-native-sound";
import PropTypes from "prop-types";

const INITIAL_ANIMATE_VALUE = 0.01;

export default class ColorTextAnimation extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {
			animation: new Animated.Value(INITIAL_ANIMATE_VALUE)
		};
		this._explode = this._explode.bind(this);
	}

	componentDidMount() {
		switch (this.props.animateSpeed) {
			case 1:
				this.animationDurationInMsec = 2000;
				break;
			case 2:
				this.animationDurationInMsec = 1000;
				break;
			case 3:
				this.animationDurationInMsec = 500;
				break;
			default:
				this.animationDurationInMsec = 2000;
		}

		Sound.setCategory("Playback");

		this.colorSound = new Sound(
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
				// 		this.colorSound.getDuration() +
				// 		"number of channels: " +
				// 		this.colorSound.getNumberOfChannels() +
				// 		" " +
				// 		this.colorSound.getVolume()
				// );
			}.bind(this)
		);

		// Reduce the volume by half
		this.colorSound.setVolume(0.5);
		// console.log("Volume after setVolume: " + this.colorSound.getVolume());

		// Position the sound to the full right in a stereo field
		this.colorSound.setPan(1);

		this._explode();
	}

	componentWillUnmount() {
		clearInterval(this.animateTimer);
		this.colorSound.release();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.color != this.props.color) {
			this.state.animation.setValue(INITIAL_ANIMATE_VALUE);
			this._explode();
			return true;
		}

		return this.state.animation.Value != INITIAL_ANIMATE_VALUE;
	}

	_explode() {
		// this.colorSound.play(
		// 	function(success) {
		// 		if (success) {
		// 			// console.log("successfully finished playing");
		// 		} else {
		// 			console.log("playback failed due to audio decoding errors");
		// 			// reset the player to its uninitialized state (android only)
		// 			// this is the only option to recover after an error occured and use the player again
		// 			this.colorSound.reset();
		// 		}
		// 	}.bind(this)
		// );
		Animated.timing(this.state.animation, {
			duration: this.animationDurationInMsec,
			toValue: 10
		})
			.start
			// function() {
			// 	this.colorSound.stop(() => {
			// 		// Note: If you want to play a sound after stopping and rewinding it,
			// 		// it is important to call play() in a callback.
			// 		this.colorSound.play();
			// 	});
			// }.bind(this)
			();
	}

	_randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	render() {
		const textSize = this.state.animation.interpolate({
			inputRange: [0, 2, 5, 9.99, 10],
			outputRange: [
				this.props.fontSize / 4,
				this.props.fontSize / 2,
				this.props.fontSize,
				this.props.fontSize / 1.5,
				this.props.fontSize
			],
			extrapolate: "clamp"
		});

		return (
			<View style={styles.container}>
				<Animated.Text
					style={[
						styles.titleText,
						{
							fontSize: textSize,
							color: this.props.color
						}
					]}
				>
					{this.props.colorText}
				</Animated.Text>
			</View>
		);
	}
}

ColorTextAnimation.propTypes = {
	color: PropTypes.string.isRequired,
	colorText: PropTypes.string.isRequired,
	animateSpeed: PropTypes.number.isRequired,
	fontSize: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
	titleText: {
		fontFamily: "monospace",
		fontWeight: "bold"
	},
	container: {
		position: "absolute",
		marginTop: 20,
		right: 20,
		height: 100
	}
});
