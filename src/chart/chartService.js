import { https } from "../Service/ConFigURL"

export const chartService = {
    getChartList: () => {
        return https.post("/getfeedbydate")
    }
}