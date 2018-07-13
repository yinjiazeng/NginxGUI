import {createStore} from 'redux';

const defaultState = {
    access:[],
    error:[]
}

const store = createStore(function(state = defaultState, action){
    switch(action.type){
        case 'CHANGE_ACCESS':
            return Object.assign({}, state, {
                access:action.access || [],
            })
            break;
        case 'CHANGE_ERROR':
            return Object.assign({}, state, {
                error:action.error || []
            })
            break;
        default:
            return state
    }
})

export default store