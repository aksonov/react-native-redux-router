# react-native-redux-router
React Native Router using Redux architecture

## Important notice
I've decided to stop supporting this component in favor to new release react-native-router-flux (https://github.com/aksonov/react-native-router-flux).
The new version doesn't depend from concrete Flux/Redux implementation and allow you to build nested navigators easily. Also it allows to intercept route 'actions'
from your store(s).

## Why I need to use it?
- Use Redux actions to replace/push/pop screens with easy syntax like Actions.login for navigation to login screen
- Forget about passing navigator object to all React elements, use actions from anywhere in your UI code.
- Configure all of your screens ("routes") once (define animations, nav bars, etc.), at one place and then just use short actions commands. For example if you use some special animation for Login screen, you don't need to code it anywhere where an user should be redirected to login screen.
- Use route "schemas" to define common property for some screens. For example some screens are "modal" (i.e. have animation from bottom and have Cancel/Close nav button), so you could define group for them to avoid any code repeatition.
- Use popup with Redux actions (see Error popup within Example project)
- Hide nav bar for some screens easily

## Example
![demo-2](https://cloud.githubusercontent.com/assets/1321329/9466261/de64558e-4b33-11e5-8ada-0fcd49442769.gif)


```javascript
'use strict';

var React = require('react-native');
var {AppRegistry, StyleSheet,Text,View} = React;
var Launch = require('./components/Launch');
var Register = require('./components/Register');
var Login = require('./components/Login');
var {Router, routerReducer, Route, Container, Animations, Schema} = require('react-native-redux-router');
var {NavBar, NavBarModal} = require('./components/NavBar');
var Error = require('./components/Error');
var Home = require('./components/Home');

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';

let store = createStore(combineReducers({routerReducer}));

class App extends React.Component {
    render(){
        return (
            <View style={{flex:1}}>
                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
                <Router>
                    <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} navBar={NavBarModal}/>
                    <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar}/>
                    <Schema name="withoutAnimation" navBar={NavBar}/>
                    <Schema name="tab" navBar={NavBar}/>

                    <Route name="launch" component={Launch} initial={true} hideNavBar={true} title="Launch"/>
                    <Route name="register" component={Register} title="Register"/>
                    <Route name="home" component={Home} title="Home" type="replace"/>
                    <Route name="login" component={Login} schema="modal"/>
                    <Route name="register2" component={Register} schema="withoutAnimation"/>
                    <Route name="error" component={Error} schema="popup"/>
                </Router>

            </View>
        );
    }
}
class Example extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {() => <App />}
            </Provider>
        );
    }
}

AppRegistry.registerComponent('Example', () => Example);
```

components/Launch.js (initial screen)
```javascript
'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, TouchableHighlight} = React;
var Button = require('react-native-button');
var {Actions} = require('react-native-redux-router');

class Launch extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>Launch page</Text>
                <Button onPress={()=>Actions.login({data:"Custom data", title:'Custom title' })}>Go to Login page</Button>
                <Button onPress={Actions.register}>Go to Register page</Button>
                <Button onPress={Actions.register2}>Go to Register page without animation</Button>
                <Button onPress={()=>Actions.error("Error message")}>Go to Error page</Button>
            </View>
        );
    
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});

module.exports = Launch;
```

## Getting started
1. `npm install react-native-redux-router --save`
2. In top-level index.js:
    * Define Route for each app screen. Its 'type' attribute is 'push' by default, but you also could define 'replace', so navigator will replace current route with new route.
'component' attribute is React component class which will be created for this route and all route attributes will be passed to it.
'name' is unique name of Route.
    * If some your Routes have common attributes, you may define Schema element and just use 'schema' attribute for 'route'
    * If you want to define some your custom actions, just add 'Action' element inside Router.
3. In any component:
    * var {Actions} = require('react-native-redux-router');
    * Actions.ACTION_NAME(PARAMS) will call appropriate action and params will be passed to next screen. In case you want to fire 'route' actions from inner component, you should use redux import Actions from this component (not from props), use connect method for your component and use ()=>this.props.dispatch(Actions.ACTION_NAME(PARAM) 


