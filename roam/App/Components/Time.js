import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import Geolocation from './Geolocation';
// var Geolocation = require('./Geolocation');
var Confirmation = require('./Confirmation');
var iBeacon = require('./iBeacon');
var History = require('./History');
var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/styles');

import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  MapView
} from 'react-native';

class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: '1 hour', 
      selectedGroup: 'Solo'
    };
  }
  handleSelectedTime(choice) {
    this.setState({
      selectedTime: choice
    });
  }

  handleSelectedGroup(choice) {
    this.setState({
      selectedGroup: choice
    });
  }

  handleSubmit() {
    this.props.navigator.push({
      title: 'Confirmation',
      selectedTime: this.state.selectedTime,
      email: this.props.navigator.navigationContext._currentRoute.email,
      selectedTime: this.state.selectedTime,
      selectedGroup: this.state.selectedGroup,
      component: Confirmation
    });
  }

  handleHistory() {
    this.props.navigator.push({
      title: 'History',
      email: this.props.navigator.navigationContext._currentRoute.email,
      component: History
    });
  }

  iBeacon() {
    this.props.navigator.push({
      title: 'iBeacon', 
      email: this.props.navigator.navigationContext._currentRoute.email, 
      component: iBeacon
    })
  }

  render () {
    const options = [
      '1 hour',
      '2 hours',
      '4 hours',
      'Anytime'
    ];

    const groupOptions = [
      'Solo', 
      'Group'
    ];

    return (
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')} >
        <Geolocation />
        <Text style={styles.header}> pick time : </Text>
        <SegmentedControls
          tint={'#ff0066'}
          selectedTint={'white'}
          backTint={'white'}
          options={options}
          allowFontScaling={false}
          fontWeight={'bold'}
          onSelection={this.handleSelectedTime.bind(this)}
          selectedOption={this.state.selectedTime} />
        <SegmentedControls
        tint={'#ff0066'}
        selectedTint={'white'}
        backTint={'white'}
        options={groupOptions}
        allowFontScaling={false}
        fontWeight={'bold'}
        onSelection={this.handleSelectedGroup.bind(this)}
        selectedOption={this.state.selectedGroup} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)} >
            <Text style={styles.buttonText}> Roam! </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleHistory.bind(this)} >
            <Text style={styles.buttonText}> View History </Text>
        </TouchableHighlight>
      </Image>
    );
  }
}

module.exports = Time;