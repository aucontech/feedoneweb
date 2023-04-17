const SAVE_DATA = "SAVE_DATA";

const SET_TOKEN = "SET_TOKEN"

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
})

let initialState = {
    token: localStorage.getItem("token") || "",
    data: []

}
export const TokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            localStorage.setItem("token", action.payload)
            return {
                ...state,
                token: action.payload
            }
        case SAVE_DATA:
            return {
                ...state,
                data: action.payload.filter((item) => {
                    return item.name
                })
            }


        default:
            return state
    }
}


