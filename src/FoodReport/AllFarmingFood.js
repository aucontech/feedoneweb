import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';
import { ContentType, https, loadFishPond, loadFishPondData } from '../Service/ConFigURL';

const { Option } = Select;

export default function AllFarmingFood() {
    const [selectedValues, setSelectedValues] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await https.post(loadFishPond, loadFishPondData, {
                    headers: {
                        "Content-Type": ContentType
                    }
                });
                setOptions(response.data.data.list);
            } catch (error) {
            }
        };
        fetchData();
    }, []);

    const handleSelectionChange = (values) => {
        setSelectedValues(values);
    };

    return (
        <Spin >
            <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="Select values"
                value={selectedValues}
                onChange={handleSelectionChange}
            >
                {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}

            </Select>
        </Spin>
    );
};

