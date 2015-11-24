export const PUSH = 'PUSH';
export const POP = 'POP';
export const DISMISS = 'DISMISS';
export const RESET = 'RESET'
export const INIT = 'INIT'
export const CUSTOM = 'CUSTOM'
export const REPLACE = 'REPLACE'
export const SELECT = 'SELECT'

function filterParam(data){
    if (typeof(data)!='object')
        return data;
    if (!data){
        return;
    }
    var proto = (data||{}).constructor.name;
    // avoid passing React Native parameters
    if (proto != 'Object'){
        data = {};
    }
    if (data.data){
        data.data = filterParam(data.data);
    }
    return data;
}

let CoreActions = {
    push: function(data) {
        return Object.assign({type: PUSH}, filterParam(data));
    },

    pop: function(data = {}) {
        return Object.assign({type: POP}, filterParam(data));
    },

    dismiss: function(data) {
        return Object.assign({type: DISMISS}, filterParam(data));
    },

    reset: function(initial) {
        if (!initial) {
            throw new Error("Param should be non-empty");
        }
        return {
            initial,
            type: RESET
        }
    },

    init: function(initial) {
        return {
            initial,
            type: INIT
        }
    },

    custom: function(data) {
        return Object.assign({type: CUSTOM}, filterParam(data));
    },

    replace: function(data) {
        return Object.assign({type: REPLACE}, filterParam(data));
    },

    select: function(data) {
        return Object.assign({type: SELECT}, filterParam(data));
    }
};

let Actions = Object.assign({}, CoreActions);

export {CoreActions};

export default Actions;



