import React, {Component} from 'react';
import { Text, View, ImageBackground, Image, StatusBar, ScrollView, Linking, WebView } from 'react-native';
import LoginButton from './src/components/LoginButton';
import TappableText from './src/components/TappableText';
import InstaNavigationBar from './src/components/InstaNavigationBar';
import Dimensions from 'Dimensions';

const windowSize = Dimensions.get('window');
const standardComponentWidth = windowSize.width * 0.82;

const twitterIconSize = 19;

const colors = {
  facebook: 'rgb(59, 89, 152)',
  text: 'rgba(255, 255, 255, 0.75)',
  instagramButtonBorderColor: 'rgba(255, 255, 255, 0.35)',
  facebookButtonBorderColor: 'rgba(255, 255, 255, 0.35)'
}

const loginButtonInfo = {
  height: 45,
  pageFontSize: 12,
  borderWidth: 0.8,
  borderRadius: 5
}

const urls = {
  forgotInstagramLogin: 'https://www.instagram.com/accounts/password/reset',
  twitterLogin: 'https://twitter.com/login?lang=en',
  instagramSignUp: 'https://www.instagram.com/accounts/emailsignup/?hl=en',
  instagramAuthLogin: 'https://api.instagram.com/oauth/authorize/?client_id=cda6dee7d8164a868150910407962f52&redirect_uri=http://www.kaitechconsulting.com&response_type=token&scope=basic+follower_list+comments+likes',
  instagramLogout: 'https://instagram.com/accounts/logout',
  instagramBase: 'https://www.instagram.com/',
}

export default class App extends Component {

  constructor(props){

    super(props);

    this.state = {
      authenticationURL: urls.instagramAuthLogin,
      accessToken: '',
      displayAuthenticationWebView: false
    }

  }

  loginButtonPressed = () => {
    //this function is executed when either of the login buttons are pressed
    this.setState({ displayAuthenticationWebView: true });
  }


  onURLStateChange = (webViewState) => {
    //this function is called/executed everytime the URL in the browser changes

    const accessTokenSubString = 'access_token=';
    console.log("Current URL = " + webViewState.url);

    //if the current url contains the substring "access_token" then extract the access_token
    if(webViewState.url.includes(accessTokenSubString)){

      //safegaurd conditional (if) statement
      if(this.state.accessToken.length < 1){
        //the index of the beginning of the access token
        var startIndexOfAccessToken = webViewState.url.lastIndexOf(accessTokenSubString) + accessTokenSubString.length;
        var foundAccessToken = webViewState.url.substr(startIndexOfAccessToken);

        this.setState({accessToken: foundAccessToken});

      }

    }


  }

  authenticationWebViewComponent = () => {
    return (
      <WebView
        source={{ uri: this.state.authenticationURL }}
        startInLoadingState={true}
        onNavigationStateChange={this.onURLStateChange}
      />
    );
  }

  instagramFeedScreenComponent = () => {
    return (
      <View style={{flex: 1}}>
        <InstaNavigationBar />
      </View>
    );
  }

  loginWithTwitterComponent = () => {
      return (
        <View style={viewStyles.twitterLoginViewStyle}>
          <Image
            source={require('./src/images/icons/twitter_bird.png')}
            style={viewStyles.twitterIcon}
            resizeMode={'contain'}
          />
          <TappableText
            textStyle={[textStyles.forgottenLogin, textStyles.forgottenLoginBold, textStyles.twitterLogin]}
            textTapped={ () => Linking.openURL(urls.twitterLogin) }
          >
            Log In With Twitter
          </TappableText>
        </View>
      );
  }

  signUpFooterComponent = () => {
    return (
      <View style={[viewStyles.forgottenLoginEncapsulationView, viewStyles.signUpFooterComponent]}>
        <Text style={textStyles.forgottenLogin}>Dont have an account?</Text>
        <TappableText
          textStyle={[textStyles.forgottenLogin, textStyles.forgottenLoginBold]}
          textTapped={ () => Linking.openURL(urls.instagramSignUp) }
        >
          Sign Up
        </TappableText>
      </View>
    );
  }

  loginScreenComponent = () => {
    return (
      <ImageBackground
        source={require('./src/images/insta-background-2.jpg')}
        resizeMode={'cover'}
        style={viewStyles.container}
      >

        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />

        <ScrollView>

          <Image
            source={require('./src/images/instagram-text-logo.png')}
            style={viewStyles.instagramTextLogo}
            resizeMode={'contain'}
          />

          <LoginButton
            buttonViewStyle={viewStyles.instagramLoginButtonView}
            buttonTextStyle={{color: colors.text, fontWeight: '500'}}
            buttonTapped={this.loginButtonPressed}
            touchableHighlightStyle={viewStyles.instagramButtonTouchableHighlightStyle}
            activeOpacity={0.75}
          >
            Log In (Via Instagram)
          </LoginButton>

          <LoginButton
            buttonViewStyle={[viewStyles.instagramLoginButtonView, viewStyles.facebookLoginButtonView]}
            buttonTextStyle={{color: colors.text, fontWeight: '500'}}
            buttonTapped={this.loginButtonPressed}
            touchableHighlightStyle={[viewStyles.instagramButtonTouchableHighlightStyle, viewStyles.facebookButtonTouchableHighlightStyle]}
            activeOpacity={0.75}
          >
            Facebook Login
          </LoginButton>

          <View style={viewStyles.forgottenLoginEncapsulationView}>
            <Text style={textStyles.forgottenLogin}>Forgot your login details?</Text>
            <TappableText
              textStyle={[textStyles.forgottenLogin, textStyles.forgottenLoginBold]}
              textTapped={ () => Linking.openURL(urls.forgotInstagramLogin) }
            >
              Get help signing in
            </TappableText>
          </View>

          <View style={viewStyles.orSeparatorView}>
            <View style={viewStyles.orSeparatorLine}/>
            <Text style={textStyles.orSeparatorTextStyle}>OR</Text>
            <View style={viewStyles.orSeparatorLine}/>
          </View>

          {this.loginWithTwitterComponent()}

        </ScrollView>


      {this.signUpFooterComponent()}

      </ImageBackground>
    );
  }

  render() {

    var hasSuccesfullyLoggedIn = (this.state.accessToken.length > 1);
    var shouldDisplayLoginScreen = (this.state.displayAuthenticationWebView == false && this.state.accessToken.length < 1);

    // console.log("this.state.displayAuthenticationWebView = " + this.state.displayAuthenticationWebView )

    if(shouldDisplayLoginScreen) {
      return (
        this.loginScreenComponent()
      );
    }
    else if(hasSuccesfullyLoggedIn){
      return (
        this.instagramFeedScreenComponent()
      );
    }
    else if (this.state.displayAuthenticationWebView == true) {
      return(
        this.authenticationWebViewComponent()
      );
    }


  }



}

const viewStyles = {
  container: {
    flex: 1,
    alignItems: 'center'
  },
  instagramTextLogo: {
    width: 150,
    height: 80,
    marginTop: '30%',
    marginBottom: 25,
    alignSelf: 'center'
  },
  instagramLoginButtonView: {
    backgroundColor: 'transparent',
    borderColor: colors.instagramButtonBorderColor,
    borderWidth: loginButtonInfo.borderWidth,
    borderRadius: loginButtonInfo.borderRadius,
    width: standardComponentWidth,
    height: loginButtonInfo.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instagramButtonTouchableHighlightStyle: {
    backgroundColor: 'transparent',
    width: standardComponentWidth,
    height: loginButtonInfo.height,
    marginTop: 5
  },
  facebookButtonTouchableHighlightStyle: {
    marginTop: 20,
    marginBottom: 5
  },
  facebookLoginButtonView: {
    backgroundColor: colors.facebook
  },
  forgottenLoginEncapsulationView: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orSeparatorView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    paddingHorizontal: 5
    // backgroundColor: 'white'
  },
  orSeparatorLine: {
    height: 1,
    flex: 5,
    backgroundColor: colors.instagramButtonBorderColor,
    borderColor: colors.instagramButtonBorderColor,
    borderWidth: 0.5,
    marginHorizontal: 5
  },
  twitterLoginViewStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  twitterIcon: {
    width: twitterIconSize,
    height: twitterIconSize,
    marginHorizontal: 4
  },
  signUpFooterComponent: {
    flex: 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.25)',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 5.5},
    height: null,
    width: windowSize.width
  }

};

const textStyles = {

  forgottenLogin: {
    color: 'white',
    fontSize: loginButtonInfo.pageFontSize,
    backgroundColor: 'transparent'
  },
  forgottenLoginBold: {
    fontWeight: 'bold',
    marginLeft: 3
  },
  orSeparatorTextStyle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    fontSize: 13
  },
  twitterLogin: {
    fontSize: 13
  }

};
