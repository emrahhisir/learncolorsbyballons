import React, { Component } from "react";
import { StyleSheet, Animated, View } from "react-native";
import Art, { Surface, Group, Shape, Path } from "ReactNativeART";
import Sound from "react-native-sound";
import PropTypes from "prop-types";

var AnimatedShape = Animated.createAnimatedComponent(Shape);

export default class ColorTextAnimation extends Component<{}> {
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
				console.log(
					"duration in seconds: " +
						this.colorSound.getDuration() +
						"number of channels: " +
						this.colorSound.getNumberOfChannels() +
						" " +
						this.colorSound.getVolume()
				);
			}.bind(this)
		);

		// Reduce the volume by half
		this.colorSound.setVolume(0.5);
		console.log("Volume after setVolume: " + this.colorSound.getVolume());

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
			this.state.animation.setValue(0);
			this._explode();
			return true;
		}

		return this.state.animation.Value != 0;
	}

	_explode() {
		// this.colorSound.play(
		// 	function(success) {
		// 		if (success) {
		// 			console.log("successfully finished playing");
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
			toValue: 28
		}).start(
			function() {
				// this.colorSound.stop(() => {
				// 	// Note: If you want to play a sound after stopping and rewinding it,
				// 	// it is important to call play() in a callback.
				// 	this.colorSound.play();
				// });
			}.bind(this)
		);
	}

	_randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	render() {
		const textSize = this.state.animation.interpolate({
			inputRange: [0, 5, 9, 13],
			outputRange: [
				0,
				this.props.fontSize / 2,
				this.props.fontSize,
				this.props.fontSize * 2 / 3
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
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
	colorText: PropTypes.string.isRequired,
	animateSpeed: PropTypes.number.isRequired,
	fontSize: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
	titleText: {
		fontFamily: "Chalkduster",
		fontWeight: "bold"
	},
	container: {
		position: "absolute",
		marginTop: 20,
		right: 20
	}
});
