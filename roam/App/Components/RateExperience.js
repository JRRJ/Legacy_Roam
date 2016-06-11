import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';

var Time = require('./Time');
var History = require('./History');
console.log('these are not the same but why', Time, History);
var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/styles');

console.log('Time on RateExperience page = ', Time);

import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';

class RateExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      venue: this.props.navigator.navigationContext._currentRoute.lastRoam.venue,
      isLoading: false
    };
  }

  handleSelected(choice) {
    this.setState({
      rating: choice
    });
  }

  handleSubmit() {
    this.setState({
      isLoading: true
    })
    if(this.state.rating > 0){
      console.log('Sending rating (but not really yet lol');
      fetch('http://10.6.28.57:3000/finished', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.props.navigator.navigationContext._currentRoute.email,
            rating: this.state.rating,
            roamId: this.props.navigator.navigationContext._currentRoute.lastRoam.id
          })
        })
        .then((res) => {
          this.props.navigator.push({
            title: 'When are you free?',
            email: this.props.navigator.navigationContext._currentRoute.email,
            component: Time
          });
          this.setState({
            isLoading: false
          })
        })      
    }
  }

  render() {
    return (
      <Image style={styles.backgroundImage}
      source = {require('../../imgs/uni.jpg')}>
      <Text style={styles.confirmation}>How was your Roam at {this.state.venue}?</Text>
      <SegmentedControls
        tint={'#ff0066'}
        selectedTint={'white'}
        backTint={'white'}
        options={[
          1,
          2,
          3,
          4,
          5
        ]}
        allowFontScaling={false}
        fontWeight={'bold'}
        onSelection={this.handleSelected.bind(this)}
        selectedOption={this.state.rating} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)} >
            <Text style={styles.buttonText}> Continue Roaming </Text>
        </TouchableHighlight>
      </Image>
    );
  }
}

module.exports = RateExperience;