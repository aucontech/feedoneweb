
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

const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post(
                BaseUrlLogin,
                { username: values.username, password: values.password },
                {
                    headers: {
                        "Content-Type": ContentType,
                    },
                }
            );
            const token = response.data.data.token;
            localStorage.setItem("token", token);
            dispatch(setToken(token));
            history("/HomePage");
            message.success("Đăng nhập thành công", 3);
        } catch (error) {
            message.error("Tài khoản hoặc mật khẩu không đúng!", 3);
        }
    };

    return (
        <div className="login-container">
            <div className="">
                <img className="fish-sh" src={fishSh} alt="" />
            </div>

            <div className="login-form-container">
                <div className="login-form-logo-container">
                    <img className="fishsh" src={logoFish} alt="" />
                </div>
                <div className="login-form">
                    <p className="text-hethong">Hệ Thống Quản Lý Ao</p>
                    <p className="login-form-subtitle py-10">Đăng nhập để tiếp tục</p>
                    <Form name="normal_login" className="login-form" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        >
                            <Input
                                style={{ width: 400, height: 50 }}
                                prefix={<UserOutlined className="site-form-item-icon text-xl" />}
                                placeholder="Tên đăng nhập"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password
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
