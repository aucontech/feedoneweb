
import { Button, Form, Input, message, } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from "../../Service/TokenReducers";
import logoFish from "./img/logo-vh.png";
import fishSh from "./img/fish.png";
import "./LoginPage.css";
import { BaseUrlLogin, ContentType } from "../../Service/ConFigURL";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [fullName, setFullName] = useState()
    console.log('fullName: ', fullName);
    const onFinish = async (values) => {
        setUsername(values.username)
        setPassword(values.password)
    };
    useEffect(() => {
        const fetch = async () => {


            try {
                const res = await axios.post(BaseUrlLogin,
                    { username, password },
                    {
                        headers: {
                            "Content-Type": ContentType
                        }
                    },
                )
                const token = res.data.data.token
                localStorage.setItem("token", token)
                localStorage.setItem('fullName', fullName)
                if (token) {
                    history("/HomePage")
                } else {
                    history("/")
                }
            } catch (err) {
                console.log('err: ', err);
            }
        }
        fetch()
    }, [username, password])

    return (
        <div className="login-container">


            <div className="login-form-container">
                <div className="login-form-logo-container">
                    <img className="fishsh" src={logoFish} alt="" />
                </div>
                <div className="login-form">
                    <p className="text-hethong">Hệ Thống Quản Lý Ao</p>
                    <p className="login-form-subtitle ">Đăng nhập để tiếp tục</p>
                    <Form name="normal_login" className="login-form py-5" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        >
                            <Input
                                className="login-pass-id"
                                style={{ width: 400, height: 50 }}
                                prefix={<UserOutlined className="site-form-item-icon text-xl" />}
                                placeholder="Tên đăng nhập"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password className="login-pass-id"
                                style={{ width: 400, height: 50 }}
                                prefix={<LockOutlined className="site-form-item-icon text-xl " />}
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
