import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginFunc = (e) => {
    e.preventDefault();
    console.log(`username = ${username}`);
    console.log(`password = ${password}`);
 
    if (!username.match("^[A-Za-z0-9_]+$")) {
      Swal.fire(
        "Username ภาษาอังกฤษเท่านั้น",
        "กรุณาเเก้ไข Username!",
        "warning"
      );
      return 0;
    }

    axios
      .post("http://127.0.0.1:5000/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === true) {
          localStorage.setItem("login", 1);
          localStorage.setItem("data", JSON.stringify(res.data.data));
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "กำลังเข้าสู่ระบบ",
          }).then(() => {
            navigate("/profile");
          });
        } else {
          localStorage.setItem("login", 0);
          localStorage.setItem("data", "");
          Swal.fire({
            position: "center",
            icon: "error",
            title: "แจ้งเตือน",
            text: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen w-full">
      <div className="bg-white flex flex-col justify-center">
        <form
          className="max-w-[500px] w-full mx-auto bg-indigo-900 p-8 px-8 rounded-lg"
          onSubmit={loginFunc}
        >
          <h2 className="text-3xl dark:text-white font-bold text-center">
            SIGN IN
          </h2>

          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Username</label>
            <input
              className="rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="text"
              minLength={4}
              maxLength={12}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Password</label>
            <input
              className="rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="password"
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className="flex justify-around mt-3 font-bold">
            <button className="bg-teal-400 text-white px-5 py-2 rounded-lg text-center w-80 mr-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-500/40 hover:bg-teal-300">
              Log in
            </button>
            <Link
              to="/regis"
              className="bg-cyan-400 text-white  px-5 py-2 rounded-lg text-center w-80 ml-2 shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/40 hover:bg-cyan-300"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
