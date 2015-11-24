var assert = require('assert');
import routeReducer from '../reducer';
import Actions from '../actions';

describe("Reducer tests", function() {

    it("Test push/pop", function() {
        let nextState = routeReducer({}, Actions.init("login"));
        assert.equal(1, nextState.routes.length);
        assert.equal("login", nextState.currentRoute);
        assert.equal("login", nextState.routes[0]);
        nextState = routeReducer(nextState, Actions.push({name: "main"}));
        assert.equal(2, nextState.routes.length);
        assert.equal("main", nextState.currentRoute);
        assert.equal("login", nextState.routes[0]);
        assert.equal("main", nextState.routes[1]);
        nextState = routeReducer(nextState, Actions.pop());
        assert.equal(1, nextState.routes.length);
        assert.equal("login", nextState.currentRoute);
        assert.equal("login", nextState.routes[0]);
    });
});
