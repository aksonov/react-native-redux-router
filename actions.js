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
        return {
            ... filterParam(data),
            type: PUSH
        }
    },

    pop: function(data = {}) {
        return {
            ... filterParam(data),
            type: POP
        }
    },

    dismiss: function(data) {
        return {
            ... filterParam(data),
            type: DISMISS
        }
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
        return {
            ... filterParam(data),
            type: CUSTOM
        }
    },

    replace: function(data) {
        return {
            ... filterParam(data),
            type: REPLACE
        }
    },

    select: function(data) {
        return {
            ... filterParam(data),
            type: SELECT
        }
    }
}

let Actions = {... CoreActions}

export {CoreActions, Actions};



