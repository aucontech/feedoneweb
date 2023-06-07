// import React, { useState } from 'react';

// const Login = ({ onLogin }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleLogin = (e) => {
//         e.preventDefault();

//         // Thực hiện kiểm tra tài khoản ở đây
//         if (username === 'admin' && password === '123456') {
//             onLogin('ADMIN'); // Gọi hàm callback và truyền sysRoles tương ứng vào
//         } else if (username === 'user' && password === '123456') {
//             onLogin('USER');
//         }
//         else if (username === 'superadmin' && password === '123456') {
//             onLogin('SUPER_ADMIN');
//         } else {
//             alert('Đăng nhập không thành công');
//         }
//     };

//     return (
//         <div>
//             <h2>Đăng nhập</h2>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label>Tên đăng nhập:</label>
//                     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Mật khẩu:</label>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 </div>
//                 <button type="submit">Đăng nhập</button>
//             </form>
//         </div>
//     );
// };

// const SuperAdminComponent = () => {
//     return <div>Phần nội dung cho SUPER_ADMIN</div>;
// };

// const AdminComponent = () => {
//     return <div>Phần nội dung cho ADMIN</div>;
// };

// const UserComponent = () => {
//     return <div>Phần nội dung cho USER</div>;
// };

// const MyComponent = ({ sysRoles }) => {
//     if (sysRoles === 'SUPER_ADMIN') {
//         return <SuperAdminComponent />; 
//     } else if (sysRoles === 'ADMIN') {
//         return <AdminComponent />;
//     } else if (sysRoles === 'USER') {
//         return <UserComponent />;
//     }
// };

// const TestRoles = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRoles, setUserRoles] = useState('');

//     const handleLogin = (roles) => {
//         setIsLoggedIn(true);
//         setUserRoles(roles);
//     };

//     return (
//         <div>
//             {isLoggedIn ? (
//                 <MyComponent sysRoles={userRoles} />
//             ) : (
//                 <Login onLogin={handleLogin} />
//             )}
//         </div>
//     );
// };

// export default TestRoles;
// import React, { useEffect, useState } from 'react'
// import { ApiScaleByDay, https } from '../Service/ConFigURL'

// export default function TestRoles() {


//     console.log('dataChart: ', dataChart);

//     useEffect(() => {
//         loadChartScale()
//     }, [])

//     const loadChartScale = async () => {
//         const Params = {
//             "data": {
//                 "startdate": "2023-01-01",
//                 "enddate": "2023-06-06",
//                 "aoid": 3
//             }
//         }
//         try {
//             const token = localStorage.getItem('token')
//             const res = await https.post(ApiScaleByDay, Params)

//             if (token) {

//                 setDataChart(res.data.data.datachart[0].lstDate)
//             }
//         } catch (err) {
//             console.log('err: ', err);

//         }
//     }
//     return (
//         <div>TestRoles</div>
//     )
// }
