import React, { Component } from 'react';

var RateExperience = require('./RateExperience');

//Require authentication component
var SignUp = require('./Signup');
var Time = require('./Time');

var styles = require('./Helpers/styles');
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;

console.log('Time on Main page = ', Time);

import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: false,
      errorMessage: ''
    };
  }

  getUser(token) {
    fetch('https://graph.facebook.com/me?fields=name,email,picture.type(large)&access_token=' + token) 
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var firstName = data.name.split(" ")[0];
        var lastName = data.name.split(" ")[1];
        var email = data.email;
        var id = data.id;
        var picture = data.picture.data.url;
        fetch('http://10.6.28.57:3000/signup', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            fb: true,
            email: email,
            password: null,
            picture: picture
          })
        })
        .then((res) => {
          fetch('http://10.6.28.57:3000/finished?email=' + email.toLowerCase(), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            console.log("CHECK YOUR EMAIL", email);
            this.setState({
              isLoading: false
            });            
            if(res.id !== null){ //if so, go to ratings page
              console.log('rate the roam');
              this.setState({
                isLoading: true
              });
              this.props.navigator.push({
                title: 'How was your roam?',
                email: email,
                component: RateExperience,
                lastRoam: {id:res.id, venue:res.venue}
              });
              this.setState({
                isLoading: false
              });
            } else { //otherwise continue to scheduling page
              console.log('continue to main page');
              this.props.navigator.push({
                title: 'When are you free?',
                email: email,
                component: Time
              });
            }
          });
        })
        .catch((error) => {
          console.log('Error in facebook post to server', error);
        })
      })
    .catch((error) => { 
       console.log("Error in facebook get user infor", error);
    });
  }

  handleEmail(event) {
    this.setState({
      email: event.nativeEvent.text
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }

  handleSignIn() {
    this.setState({
      isLoading: true
    });
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.email === '' || !re.test(this.state.email)) {
      this.setState({
        isLoading: false,
        error: true,
        errorMessage: 'Invalid Email!'
      });
    }
    if (this.state.password === '') {
      this.setState({
        isLoading: false,
        error: true,
        errorMessage: 'Invalid Password!'
      });
    }
    //If email and password exists on the database, log the user into the select time page
    if(this.state.email !== '' && re.test(this.state.email) && this.state.password !== ''){
      fetch('http://10.6.28.57:3000/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.state.password,
          email: this.state.email.toLowerCase(),
        })
      })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if(res.message === 'Incorrect email/password combination!'){
          this.setState({errorMessage: res.message, error: true, isLoading: false});
        } else{
          //check to see if user has recent roams
          fetch('http://10.6.28.57:3000/finished?email=' + this.state.email.toLowerCase(), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.setState({
              isLoading: false
            });            
            if(res.id !== null){ //if so, go to ratings page
              console.log('rate the roam');
              this.setState({
                isLoading: true
              });
              this.props.navigator.push({
                title: 'How was your roam?',
                email: this.state.email.toLowerCase(),
                component: RateExperience,
                lastRoam: {id:res.id, venue:res.venue}
              });
              this.setState({
                isLoading: false
              });
            } else { //otherwise continue to scheduling page
              console.log('continue to main page');
              this.props.navigator.push({
                title: 'When are you free?',
                email: this.state.email.toLowerCase(),
                component: Time
              });
            }
          });
        }
      })
      .catch((error) => {
        //expand error handling to UI?
        console.log('Error handling submit:', error);
      });
    }
  }

  handleSignUp() {
    this.setState({
      isLoading: true
    });
    this.props.navigator.push({
      title: 'Sign Up',
      component: SignUp
    });
    this.setState({
      isLoading: false
    });
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.errorMessage}> {this.state.errorMessage} </Text> : <View></View>
    );
    return(
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')}>
        <Text style={styles.title}> roam </Text>
        {/* Fields that we want to bind the email and password input to */}
        <TextInput
          style={styles.submit}
          placeholder="Email"
          placeholderTextColor="white"
          value={this.state.email}
          onChange={this.handleEmail.bind(this)}/>
        <TextInput
          style={styles.submit}
          placeholder="Password"
          placeholderTextColor="white"
          value={this.state.password}
          onChange={this.handlePassword.bind(this)}
          secureTextEntry={true}/>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSignIn.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}> Sign In </Text>
        </TouchableHighlight>
        <LoginButton
          style={styles.button}
          readPermissions={["email","user_friends", "public_profile"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    {this.getUser.bind(this, data.accessToken.toString())()};
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
        <TouchableHighlight
          // style={styles.button}
          onPress={this.handleSignUp.bind(this)}
          underlayColor="transparent" >
            <Text style={styles.signUpButton}> Not a user? Sign Up </Text>
        </TouchableHighlight>
        {/* This is the loading animation when isLoading is set to true */}
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color="#111"
          size="large"></ActivityIndicatorIOS>
        {showErr}
      </Image>
    )
  }
}

module.exports = Main;
