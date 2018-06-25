import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  Button,
  ScrollView
} from "react-native";

import { AdMobInterstitial } from "react-native-admob";

const BannerExample = ({ style, title, children, ...props }) => (
  <View {...props} style={[styles.example, style]}>
    <Text style={styles.title}>{title}</Text>
    <View>{children}</View>
  </View>
);

export default class AdsController extends Component {
  constructor(props) {
    super(props);

    this.adOpened = this.adOpened.bind(this);
    this.adClosed = this.adClosed.bind(this);
  }

  componentDidMount() {
    AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
    AdMobInterstitial.setAdUnitID("ca-app-pub-3940256099942544/4411468910");

    AdMobInterstitial.addEventListener("adLoaded", this.adLoaded);
    AdMobInterstitial.addEventListener("adFailedToLoad", error =>
      this.adFailedToLoad(error)
    );
    AdMobInterstitial.addEventListener("adOpened", this.adOpened);
    AdMobInterstitial.addEventListener("adClosed", this.adClosed);
    AdMobInterstitial.addEventListener(
      "adLeftApplication",
      this.adLeftApplication
    );

    AdMobInterstitial.requestAd().catch(error => console.warn(error));
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  showInterstitial() {
    AdMobInterstitial.showAd().catch(error => console.warn(error));
  }

  adLoaded() {
    console.log("AdMobInterstitial adLoaded");
  }

  adFailedToLoad(error) {
    console.warn(error);
  }

  adOpened() {
    console.log("AdMobInterstitial => adOpened");
    this.props.adOpened();
  }

  adClosed() {
    console.log("AdMobInterstitial adClosed");
    AdMobInterstitial.requestAd().catch(error => console.warn(error));
    this.props.adClosed();
  }

  adLeftApplication() {
    console.log("AdMobInterstitial => adLeftApplication");
  }

  render() {
    if (this.props.showAd) {
      return <View style={styles.container}>{this.showInterstitial()}</View>;
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 30 : 10
  },
  example: {
    paddingVertical: 10
  },
  title: {
    margin: 10,
    fontSize: 20
  }
});
