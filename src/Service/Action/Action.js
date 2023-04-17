import { SET_VUNG_NUOI } from "../Constant";
import { VungNuoiService } from "../VungNuoiReducer"

export const getVungNuoiActionService = () => {
    return (dispatch) => {

        VungNuoiService.getVungNuoiList()
            .then((res) => {
                dispatch({
                    type: SET_VUNG_NUOI,
                    payload: res.data.data.list
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }
}