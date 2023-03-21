import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function Register() {
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [username, setUsername] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [pw, setpw] = useState("");
  const [pwCf, setpwconfirm] = useState("");
  const navigate = useNavigate();
  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size / 1024 > 5120) {
        Swal.fire("ขนาดไฟล์เกิน 5 MB", "กรุณาเปลี่ยนขนาดไฟล์รูปภาพ!", "error");
      } else {
        setPicture(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const regiserFunc = async (e) => {
    e.preventDefault();
    if (!username.match("^[A-Za-z0-9_]+$")) {
      //   Swal.fire("สมัครสมาชิกเรียบร้อย", "", "success");
      // } else {
      Swal.fire(
        "Username อยู่ระหว่าง [A-Z] [a-z] [0-9] _]",
        "กรุณาเเก้ไข Username!",
        "warning"
      );
      return 0;
    }
    if (pw !== pwCf) {
      Swal.fire("Password ไม่ตรงกัน", "", "warning");
      return 0;
    } else {
      console.log("ok");
    }
    if (pw.indexOf("abc") !== -1) {
      Swal.fire(
        "Password 'ตัวอักษร' ต้องไม่เรียงกัน",
        "ตัวอย่างที่ไม่ถูกต้องเช่น 'abcde'",
        "warning"
      );
      return 0;
    }
    if (pw.indexOf("123") !== -1) {
      Swal.fire(
        "Password 'ตัวเลข' ต้องไม่เรียงกัน",
        "ตัวอย่างที่ไม่ถูกต้องเช่น '12345'",
        "warning"
      );
      return 0;
    }
    console.log(imgData);
    console.log(username);
    console.log(pw);
    console.log(Fname);
    console.log(Lname);
    const formData2 = new FormData();
    formData2.append("username", username);
    formData2.append("password", pw);
    formData2.append("firstname", Fname);
    formData2.append("lastname", Lname);
    formData2.append("file", picture);
    console.log(formData2);
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      axios
        .post("http://127.0.0.1:5000/register", formData2, options)
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
              title: "สมัครสมาชิกสำเร็จ",
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
      // const response = await axios({
      //   method: "post",
      //   url: "/register",
      //   data: formData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen w-full">
      <div className="bg-white flex flex-col justify-center">
        <form
          onSubmit={regiserFunc}
          className="max-w-[700px] w-full mx-auto bg-indigo-900 p-10 px-8 rounded-lg"
        >
          <h2 className="text-3xl dark:text-white font-bold text-center">
            Register
          </h2>

          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Username *</label>
            <input
              className=" peer rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="text"
              minLength={4}
              maxLength={12}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
            <p className="mt-2 invisible peer-invalid:visible text-yellow-500  text-xs italic font-normal">
              Username ความยาวไม่ต่ำกว่า 4 ตัวอักษร
            </p>
          </div>
          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Password *</label>
            <input
              className="peer rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="password"
              minLength={6}
              onChange={(e) => setpw(e.target.value)}
              value={pw}
              required
            />
            <p class="mt-2 invisible peer-invalid:visible text-yellow-500  text-xs italic font-normal">
              Password ความยาวไม่ต่ำกว่า 6 ตัวอักษร
            </p>
          </div>
          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Comfirm password *</label>
            <input
              className="peer rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="password"
              minLength={6}
              onChange={(e) => setpwconfirm(e.target.value)}
              value={pwCf}
              required
            />
            <p class="mt-2 invisible peer-invalid:visible text-yellow-500  text-xs italic font-normal">
              Password ความยาวไม่ต่ำกว่า 6 ตัวอักษร
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div className="flex flex-col text-indigo-900 py-2 font-semibold">
              <label className="text-white font-normal">Firstname * </label>
              <input
                className="rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
                type="text"
                maxLength={60}
                onChange={(e) => setFname(e.target.value)}
                required="invalid:border-red-500"
              />
              <p class="text-yellow-500 mt-2 text-xs italic font-normal">
                ชื่อต้องไม่เกิน {Fname.length}/60
              </p>
            </div>
            <div className="flex flex-col text-indigo-900 py-2 font-semibold">
              <label className="text-white font-normal">Lastname </label>
              <input
                className="rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
                type="text"
                maxLength={60}
                onChange={(e) => setLname(e.target.value)}
              />
              <p class="text-yellow-500 mt-2 text-xs italic font-normal">
                นามสกุลต้องไม่เกิน {Lname.length}/60
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <label className="block">
              <span className="sr-only ">Choose profile photo</span>
              <input
                type="file"
                className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                required
                onChange={onChangePicture}
                accept="image/png , image/jpg ,image/jpeg ,image/bmp"
              />
            </label>
          </div>
          <label className="text-white font-normal">Sample picture</label>

          <div className="shrink-0 my-2">
            <img
              className="h-60 w-60 object-cover rounded-lg bg-white"
              src={imgData}
            />

            <p className="text-yellow-500 my-1 text-xs italic font-normal">
              Size {picture ? (picture.size / 1024 / 1024).toFixed(2) : 0} MB
            </p>
          </div>

          <div className="flex justify-around mt-3 font-bold">
            <Link
              to="/"
              className="bg-teal-400 text-white px-5 py-2 rounded-lg text-center w-80 mr-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-500/40 hover:bg-teal-300"
            >
              I am already member
            </Link>

            <button

              className="bg-cyan-400 text-white  px-5 py-2 rounded-lg text-center w-80 ml-2 shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/40 hover:bg-cyan-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
