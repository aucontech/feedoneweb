import axios from "axios";
export const BaseUrlLogin = "http://easyfeed.vn/v1/login"; // API login
export const ContentType = "application/json; charset=utf-8"; //Content Type

export const listFarmingArea = '/farmingareas'; //Api load vùng nuôi
export const startAndlimit = { // params của API load vùng nuôi
    "start": 0, "limit": 0
}
export const ApiUpdateArea = "/farmingarea/update"; // API cập nhật và thêm mới vùng nuôi

export const ApiLoadStations = "/stations"; //API load trạm bơm
export const ApiUpdateCreate = "/station/update"; // API cập nhật trạm bơm và thêm mới

export const ApiFeedByDate = "/getfeedbydate"; // API load thức ăn theo kg trên ngày

export const loadFishPond = "/getfishpond"; // API danh sách ao
export const loadFishPondData = { //Params của API danh sách ao
    "data": {
    }
}

export const GetSumMassByYear = "/getsummassbyyear"

export const getSumByDay = "/getsummassbydate"

export const getSumByMonth = "/getsummassbymonth"

export const foodBagByDate = "/getfeedquantitybydate"; // API load thức ăn theo bao trên ngày

export const ApiQuanTrac = "/getdevicemonitoring"; // API quan trắc thống kê pH , DO , Nhiệt độ

export const ApiAccumulatedFishPond = "/getfeedbyperiodtime"; // API lũy kế số bao và kg thức ăn đã sử dụng
export const ParamsOfAccumulated = { // Params của API lũy kế lũy kế số bao và kg thức ăn đã sử dụng
    "data": {
        "startdate": "2023-04-01",
        "enddate": "2023-04-30",
        "aoid": 4
    }
}

export const updateListFeed = "/updatefeed"

export const https = axios.create({ //https của tất cả API 
    baseURL: "http://localhost:8300/v1",
})
https.interceptors.request.use( // quét token liên tục
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);




