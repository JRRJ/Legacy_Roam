import React, { Component } from 'react';

var Separator = require('./Helpers/Separator');
var HistoryElem = require('./HistoryElem');
var styles = require('./Helpers/styles');
var Time = require('./Time')

import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: []
    }
  }

  componentWillMount() {
    fetch('http://10.6.28.57:3000/history?email=' + this.props.navigator.navigationContext._currentRoute.email, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((res) => {
      console.log(res);
      this.setState({
        experiences: res
      })
    })
  }

  returnToMain() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <Image style={styles.backgroundImage}
      source = {require('../../imgs/uni.jpg')}>
      <Text style={styles.header}>History</Text>
      {this.state.experiences.map((res, index) => {
        return <HistoryElem key={index} data={res}/>
      })}
      <TouchableHighlight
        style={styles.button}
        onPress={this.returnToMain.bind(this)} >
          <Text style={styles.buttonText}>New Roam</Text>
      </TouchableHighlight>
      </Image>
    );
  }
}

module.exports = History;