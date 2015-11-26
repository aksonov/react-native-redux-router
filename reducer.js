import {INIT, PUSH, REPLACE, POP, DISMISS, RESET} from './actions';

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function clone(map){
    var el = {};
    for (var i in map)
        if (typeof(map[i])!='object')
            el[i] = map[i];
    return el;
}

export default function reducer(state = { routes: [], currentRoute: null}, action) {
    switch (action.type) {
        case INIT:
            return {
                routes: [action.initial],
                currentRoute: action.initial
            };
        case PUSH:
            return {
                data: action.data || null,
                mode: PUSH,
                routes: [...state.routes, action.name],
                currentRoute: action.name
            };
        case REPLACE:
            return {
                data: action.data || null,
                mode: REPLACE,
                routes: [...state.routes.slice(0, state.routes.length - 1), action.name],
                currentRoute: action.name
            };
        case POP:
            let num = isNumeric(action.data) ? action.data : 1;
            if (state.routes.length <= num) {
                throw new Error("Number of routes should be greater than pop() param: " + num);
            }
            return {
                mode: POP,
                routes: [...state.routes.slice(0, state.routes.length - num)],
                currentRoute: state.routes[state.routes.length - num - 1]
            };
        case DISMISS:
            if (state.routes.length <= 1) {
                throw new Error("Number of routes should be greater than 1");
            }
            return {
                mode: DISMISS,
                routes: [...state.routes.slice(0, state.routes.length - 1)],
                currentRoute: state.routes[state.routes.length - 2]
            };
        case RESET:
            return {
                mode: RESET,
                routes: [action.initial],
                initial: action.initial
            }

        default:
            return state;
    }
};
