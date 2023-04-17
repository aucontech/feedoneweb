import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { https } from "../Service/ConFigURL";
import "./QuanLyVungNuoi.css";

export default function QuanLyVungNuoi() {
    const [farmingAreas, setFarmingAreas] = useState([]);
    const [formData, setFormData] = useState({});
    const [selectedFarmingArea, setSelectedFarmingArea] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const history = useNavigate();
    const handleSelectFarmingArea = (item) => {
        setSelectedFarmingArea(item);
        setFormData(item);
        setSelectedId(item.id === selectedId ? null : item.id)
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await https.post("/farmingareas", {
                });
                if (!token) {
                    message.error("Bạn không đủ quyền truy cập");
                    history("/");
                } else {
                    setFarmingAreas(response.data.data.list)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [isUpdating]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await https.post("/farmingarea/update", { data: formData }, {
            }
            );
            console.log('formData: ', formData);
            setFormData({});
            setSelectedFarmingArea(res.data.data);
            setSelectedId(null)
            setFarmingAreas(
                farmingAreas.map((item) => {
                    return item.id === res.data.data.id ? res.data.data : item
                })
            )
            message.success("Cập nhật thành công")
            setIsUpdating((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClearForm = () => {
        setFormData({
        });
        setSelectedId(null)
        setSelectedFarmingArea({})
    }
    const generateNewId = () => {
        const currentIds = farmingAreas.map((item, index) => {
            return item.id
        });
        let newId = 1;
        while (currentIds.includes(newId)) {
            newId++;
        }
        return newId;
    };

    const handleAddFarmingArea = async () => {
        try {
            const params = { ...formData, "__cls__": "com.aqa.saqa.model.entity.FarmingArea", }
            const response = await https.post("/farmingarea/update", { data: params })
            const newFarmingArea = response.data.data;
            setFarmingAreas([...farmingAreas, newFarmingArea]);
            setFormData({})
            message.success("Thêm mới thành công.")
            setIsUpdating((prev) => !prev)
        } catch (error) {
            console.log(error);
        }
    }

    const renderListVungNuoi = () => {
        return farmingAreas.map((item) => {
            return (
                <tr key={item.id} className={`${selectedId === item.id ? 'bg-gray-200 , text-blue-600 , hover:bg-gray-200 ' : ''
                    } hover:bg-gray-100 cursor-pointer`}
                    onClick={() => handleSelectFarmingArea(item)}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.area}</td>
                    <td>{item.longitude}</td>
                    <td>{item.latitude}</td>
                </tr>
            );
        });
    };

    const renderTableVungNuoi = () => {
        return (
            <div className="table-container flex">
                <div className="">
                    <table className="table">
                        <thead>
                            <tr className="tr-listVN   ">
                                <th className="text-blue-600 text-2xl mt-4" >ID</th>
                                <th> <p>Name of farming</p> <hr /> Tên vùng nuôi  </th>
                                <th>  <p>Area</p> <hr />Diện tích </th>
                                <th>  <p>Longitude</p> <hr /> Kinh độ </th>
                                <th> <p>Latitude</p>  <hr />Vĩ độ  </th>
                            </tr>
                        </thead>
                        <tbody>{renderListVungNuoi()}</tbody>
                    </table>
                </div>
                <div className="" >
                    <div></div>
                    <div className="">
                        <form onSubmit={handleSubmit} className="form form-listVn text-white ">
                            <label>
                                <div className="bg-gray-100 text-black">
                                    ID
                                </div>
                                <input
                                    className="bg-gray-500 text-white"
                                    type="text"
                                    name="name"
                                    value={formData.id || selectedFarmingArea.id || ""}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label >
                                <div>
                                    Tên vùng nuôi
                                </div>
                                <input
                                    className="text-black"
                                    type="text"
                                    name="name"
                                    value={formData.name || selectedFarmingArea.name || ""}
                                    onChange={handleInputChange}
                                />
                            </label>


                            <label>
                                <div >
                                    Diện tích

                                </div>
                                <input
                                    className="text-black"

                                    type="text"
                                    name="area"
                                    value={formData.area || selectedFarmingArea.area || ""}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label>
                                <div>
                                    Kinh độ

                                </div>
                                <input
                                    className="text-black"

                                    type="text"
                                    name="longitude"
                                    value={formData.longitude || selectedFarmingArea.longitude || ""}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label>
                                <div>
                                    Vĩ độ

                                </div>
                                <input
                                    className="text-black"

                                    type="text"
                                    name="latitude"
                                    value={formData.latitude || selectedFarmingArea.latitude || ""}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <button className="bg-red-500" onClick={handleAddFarmingArea} >Add</button>
                            <button className="bg-red-500" type="submit">Cập nhật</button>
                            <button className="bg-red-500" onClick={() => {
                                handleClearForm()
                            }} type="reset" >Xóa</button>

                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div><h1 className="text-4xl" >Bảng cập nhật hệ thống Vùng Nuôi </h1></div>
            <div className="flex render-chance-list-vung-nuoi">{renderTableVungNuoi()}</div>;
        </div>
    )

};


