import { https } from "./ConFigURL";
import { SET_VUNG_NUOI } from "./Constant"

const initialState = {
    listVungNuoi: []
}
export const VungNuoiReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_VUNG_NUOI:
            state.listVungNuoi = payload
            return { ...state }
        default:
            return state

    };
};
export let VungNuoiService = {
    getVungNuoiList: () => {
        return https.post("/farmingareas")
    }
}