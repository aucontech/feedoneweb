import axios from "axios";
export const BaseUrlLogin = "http://103.176.149.93/v1/login";
export const ContentType = "application/json; charset=utf-8";

export const listFarmingArea = '/farmingareas';
export const ApiUpdateArea = "/farmingarea/update"

export const ApiLoadStations = "/stations"
export const ApiUpdateCreate = "/station/update"

export const ApiFeedByDate = "/getfeedbydate"
export const ApiStartEndChart = {
    "data": {
        "startdate": "2022-12-01",
        "enddate": "2023-04-20",
        "aoid": 9,

    }
}

export const startAndlimit = {
    "start": 0, "limit": 0
}

export const https = axios.create({
    baseURL: "http://103.176.149.93/v1",
    headers: {
    }
})
https.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

