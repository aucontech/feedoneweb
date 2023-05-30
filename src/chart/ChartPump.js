import React, { useEffect, useState } from 'react'
import { ContentType, https, listFarmingArea, startAndlimit } from '../Service/ConFigURL';

export default function ChartPump() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);
    const [pondData, setPondData] = useState([]);

    const [startDate, setStartDate] = useState([])
    const [endDate, setEndDate] = useState([])

    useEffect(
        () => {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await https.post(listFarmingArea, startAndlimit, {
                        headers: {
                            "Content-Type": ContentType,
                        },
                    });
                    if (token) {
                        setLoadNameFarming(response.data.data.list);
                    }
                } catch (err) {
                    console.log("err: ", err);
                }
            };
            fetchData();
        }, []
    );

    const Chartpump = async () => {
        const Params = {
            data: {
                startdate: startDate,
                enddate: endDate
            }
        }
        try { }
        catch (err) {
            console.log('err: ', err);

        }
    }


    return (


        <div>ChartPump</div>
    )
}
