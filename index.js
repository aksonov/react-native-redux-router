import React from 'react';
import ReactNative from 'react-native';
const {View, Navigator, Text, TouchableWithoutFeedback, StyleSheet} = ReactNative;
import {Actions, CoreActions} from './actions';
import {INIT, PUSH, REPLACE, POP, DISMISS, RESET} from './actions';

import routerReducer from './reducer';
import Animations from './Animations';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// schema class represents schema for routes and it is processed inside Router component
class Schema extends React.Component {
    className(){
        return "Schema";
    }
    render(){
        return null;
    }
}

// action class represents simple action which will be handled by user-defined stores
class Action extends React.Component {
    className(){
        return "Action";
    }
    render(){
        return null;
    }
}

// route class processed inside Router component
class Route extends React.Component {
    className(){
        return "Route";
    }
    render(){
        return null;
    }

}

class Router extends React.Component {
    constructor(props){
        super(props);
        this.routes = {};
        this.schemas = {};
        var {dispatch} = props;
        if (!dispatch){
            throw new Error("No redux dispatch is provided to Router!");
        }

        var self = this;
        this.initial = props.initial;
        var RouterActions = props.actions || Actions;

        React.Children.forEach(props.children, function (child, index){
            var name = child.props.name;
            if (!name){
                throw new Error("Name is not defined for "+child.type.prototype.className())
            }
            if (child.type.prototype.className() == "Schema") {
                self.schemas[name] = child.props;
            } else if (child.type.prototype.className() == "Route") {
                if (child.props.initial || !self.initial) {
                    self.initial = name;
                }
                if (!(RouterActions[name])) {
                    RouterActions[name] = function (data) {
                        if (typeof(data)!='object'){
                            data={data:data};
                        }
                        var args = {name: name, data:data};
                        var action = child.props.type || 'push';
                        dispatch(CoreActions[action](args));
                    };
                }
                self.routes[name] = child.props;
                if (!child.props.component && !child.props.children){
                    console.error("No route component is defined for name: "+name);
                    return;
                }

            } else  if (child.type.prototype.className() == "Action") {
                //console.log("Added action: " + name);
                if (!(RouterActions[name])) {
                    RouterActions[name] = function(data){
                        var props = self.extend({}, self.props);
                        props = self.extend(props, child.props);
                        dispatch(CoreActions.custom({name, props, data}));
                    };
                }
            }
        });
        let dispatched = bindActionCreators(CoreActions, dispatch);
        for (var i in dispatched)
            RouterActions[i] = dispatched[i];
        this.routerActions = RouterActions;
        this.initialRoute =  this.routes[this.initial] || console.error("No initial route "+this.initial);
        this.state = {initial: this.initial};
    }

    componentWillReceiveProps(props){
        if (props.mode){
            this.onChange(props)
        }
    }

    onChange(page){
        if (page.mode==PUSH || page.mode==REPLACE){
            var route = this.routes[page.currentRoute];
            if (!route){
                console.error("No route is defined for name: "+page.currentRoute);
                return;
            }
            // check if route is popup
            if (route.schema=='popup'){
                var element = React.createElement(route.component, Object.assign({}, route, page.data, {dispatch: this.props.dispatch, routes:this.routerActions}));
                this.setState({modal: element});
            } else {
                if (page.mode == REPLACE){
                    this.refs.nav.replace(this.getRoute(route, page.data))
                } else {
                    this.refs.nav.push(this.getRoute(route, page.data))
                }
            }
        }
        if (page.mode==POP){
            var routes = this.refs.nav.getCurrentRoutes();
            var num = page.num || (routes.length - page.routes.length);
            // pop only existing routes!
            if (num < routes.length) {
                this.refs.nav.popToRoute(routes[routes.length - 1 - num]);
            } else {
                if (this.props.onExit){
                    this.props.onExit(routes[0], page.data || {});
                }
            }
        }
        if (page.mode==DISMISS) {
            this.setState({modal: null});
        }

        if (page.mode==RESET){
            // reset navigation stack
            this.refs.nav.immediatelyResetRouteStack([this.getRoute(this.routes[page.initial], {})])
        }
    }

    componentDidMount(){
        this.props.dispatch(Actions.init(this.initial));
    }

    renderScene(route, navigator) {
        var Component = route.component;
        var navBar = route.navigationBar;
        var footer = route.footer;

        if (navBar) {
            navBar = React.cloneElement(navBar, {
                navigator: navigator,
                route: route,
                dispatch:this.props.dispatch,
                routes:this.routerActions
            });
        }
        if (footer){
            footer = React.cloneElement(footer, {
                navigator: navigator,
                route: route,
                dispatch:this.props.dispatch,
                routes:this.routerActions
            });
        }
        var child = null;
        if (Component){
            child = <Component key={route.name} navigator={navigator} route={route} {...route.passProps} routes={this.routerActions} dispatch={this.props.dispatch} />
        } else {
            child = React.Children.only(this.routes[route.name].children);
            child = React.cloneElement(child, {schemas: this.schemas});
        }

        return (
            <View style={styles.transparent}>
                {navBar}
                {child}
                {footer}
            </View>
        )
    }

    extend(destination, source) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    getRoute(route, data) {
        if (!route){
            console.error("No route for data:"+JSON.stringify(data));
        }
        var schema = this.schemas[route.schema || 'default'] || {};
        var sceneConfig = route.sceneConfig || schema.sceneConfig || Animations.None;
        var NavBar = route.navBar || schema.navBar;
        var Footer = route.footer || schema.footer;

        var navBar;
        if (NavBar){
            navBar = <NavBar {...schema} {...route} {...data} routes={this.routerActions} dispatch={this.props.dispatch}/>
        }

        var footer;
        if (Footer){
            footer = <Footer {...schema} {...route} {...data} routes={this.routerActions} dispatch={this.props.dispatch} />
        }
        var props = this.extend({}, route);
        props = this.extend(props, data);
        return {
            name: route.name,
            component: route.component,
            sceneConfig: {
                ...sceneConfig,
            },
            navigationBar: route.hideNavBar ? null : navBar,
            footer: route.hideFooter ? null : footer,
            passProps: props
        }
    }

    render(){
        if (!(this.props.initial || this.initial)){
            console.error("No initial attribute!");
        }
        this.initialRoute =  this.routes[this.props.initial || this.initial];
        if (!this.initialRoute) {
            console.error("No initial route!");
        }

        var modal = null;
        if (this.state.modal){
            modal = (<View style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=>Actions.dismiss()}><View style={[styles.container,{backgroundColor:'black',opacity:0.5},this.props.popupStyle]}/></TouchableWithoutFeedback>
                    {this.state.modal}

                </View>
            );
        }
        return (
            <View style={styles.transparent}>
                <Navigator
                    renderScene={this.renderScene.bind(this)}
                    configureScene={(route) => { return route.sceneConfig;}}
                    ref="nav"
                    initialRoute={this.getRoute(this.initialRoute)}
                    />
                {modal}
            </View>
        );

    }

}

var styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparent: {
      flex:1,
      backgroundColor: "transparent"
    }
});

module.exports = {Router: connect(state=>state.routerReducer)(Router), Actions, Action, Route, Animations, Schema, routerReducer}
