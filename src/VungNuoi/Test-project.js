import React, { useEffect, useState } from 'react'
import { ApiLoadStations, ContentType, https, startAndlimit } from '../Service/ConFigURL'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

export default function TestProject() {
    let history = useNavigate()

    const [isLoadStations, setIsStations] = useState({})

    useEffect(() => {
        const Fetch = async () => {
            const token = localStorage.getItem("token")
            if (token === undefined) {
                history("/")
                message.error("Bạn ko có quyền truy cập!")
            }
            try {
                const response = await https.post(ApiLoadStations, startAndlimit, {
                    headers: {
                        "Content-Type": ContentType
                    }
                })
                setIsStations(response.data.data.list)
                console.log('response: ', response);

            } catch (err) {
                console.log(err);
            }

        }
        Fetch()
    }, [])

    const handleRenderStation = () => {
        return isLoadStations.map((item, index) => {
            return <div>
                <button style={{ width: 200, height: 100, background: "gray", border: 2, margin: 5 }} >
                    {item.name}

                </button>
            </div>
        })
    }


    return (
        <div style={{ width: "100%", background: "pink", color: "white" }}  >
            {handleRenderStation()}

        </div>
    )
}
