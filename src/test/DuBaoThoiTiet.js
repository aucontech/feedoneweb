import React, { useState } from "react";
import { Select, Table } from "antd";
import moment from "moment";
import axios from "axios";

const { Option } = Select;

export default function DuBaoThoiTiet() {
    const [selectedCities, setSelectedCities] = useState([]);
    const [tableData, setTableData] = useState([]);

    const handleCitySelection = async (value) => {
        setSelectedCities(value);
        const promises = value.map((cityId) => {
            return fetchTemperatureData(cityId).then((temperatures) => {
                const data = { cityId, temperatures };
                return data;
            });
        });
        const results = await Promise.all(promises);
        const mergedData = mergeTableData(results);
        setTableData(mergedData);
    };

    const getCityName = (cityId) => {
        switch (cityId) {
            case "1642911":
                return "Jakarta";
            case "1566083":
                return "Ho Chi Minh";
            case "1699805":
                return "Manila";
            default:
                return "";
        }
    };
    const API_KEY = "e7704bc895b4a8d2dfd4a29d404285b6";

    function fetchTemperatureData(cityId) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric`;
        return axios.get(url).then((response) => {
            const data = response.data.list;
            const temperatures = {};
            data.forEach((item) => {
                const date = moment(item.dt_txt).format("YYYY-MM-DD");
                if (!temperatures[date]) {
                    temperatures[date] = {};
                }
                temperatures[date][item.dt_txt] = item.main.temp;
            });
            return temperatures;
        });
    }

    const mergeTableData = (data) => {
        const mergedData = {};
        data.forEach((item) => {
            const cityId = item.cityId;
            const temperatures = item.temperatures;
            Object.keys(temperatures).forEach((date) => {
                if (!mergedData[date]) {
                    mergedData[date] = {};
                }
                mergedData[date][cityId] = temperatures[date];
            });
        });
        return Object.keys(mergedData).map((date) => {
            return { date, ...mergedData[date] };
        });
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        ...selectedCities.map((cityId) => {
            const cityName = getCityName(cityId);
            return {
                title: cityName,
                dataIndex: cityId,
                key: cityId,
                render: (C) => (C ? `${C} °C` : ""),
            };
        }),
    ];

    return (
        <div className="App">
            <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select cities"
                onChange={handleCitySelection}
            >
                <Option value="1642911">Jakarta</Option>
                <Option value="1699805">Manila</Option>
                <Option value="1566083">Ho Chi Minh</Option>
            </Select>
            <Table dataSource={tableData} columns={columns} />
        </div>
    );
}


