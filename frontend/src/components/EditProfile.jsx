import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Register() {
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [username, setUsername] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [pw, setpw] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [dataStorage, setDataStorage] = useState([]);
  useEffect(() => {
    const login = localStorage.getItem("login");
    console.log(login);
    if (parseInt(login) === 0) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    try {
      const datalocalStorage = JSON.parse(localStorage.getItem("data"));
      setData(datalocalStorage);
      setDataStorage(datalocalStorage);
      setImgData(datalocalStorage.profileImage);
      setFname(datalocalStorage.firstname);
      setLname(datalocalStorage.lastname);
      setUsername(datalocalStorage.username);
    } catch {}
  }, []);

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

  const editFunc = async (e) => {
    e.preventDefault();

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

    console.log(pw);
    console.log(Fname);
    console.log(Lname);
    const formData2 = new FormData();

    formData2.append("id", dataStorage.id);
    formData2.append("password", pw);
    formData2.append("oldpassword", dataStorage.password);
    formData2.append("firstname", Fname);
    formData2.append("lastname", Lname);
    formData2.append("file", picture);
    console.log(formData2);
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      axios
        .put("http://127.0.0.1:5000/editprofile", formData2, options)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === true) {
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
              title: "แก้ไขข้อมูลสำเร็จ",
            }).then(() => {
              navigate("/profile");
            });
          } else {

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

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen w-full">
      <div className="bg-white flex flex-col justify-center">
        <form
          onSubmit={editFunc}
          className="max-w-[700px] w-full mx-auto bg-indigo-900 p-10 px-8 rounded-lg"
        >
          <h2 className="text-3xl dark:text-white font-bold text-center">
            Edit Profile
          </h2>

          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Username *</label>
            <input
              className="cursor-not-allowed peer rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              value={username}
              disabled
            />
            <p className="mt-2 invisible peer-invalid:visible text-yellow-500  text-xs italic font-normal">
              Username ความยาวไม่ต่ำกว่า 4 ตัวอักษร
            </p>
          </div>
          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Password</label>
            <input
              className="peer rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="password"
              minLength={6}
              onChange={(e) => setpw(e.target.value)}
              value={pw}

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
                value={Fname}
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
                value={Lname}
              />
              <p class="text-yellow-500 mt-2 text-xs italic font-normal">
                นามสกุลต้องไม่เกิน {Lname.length}/60
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <label class="block">
              <span class="sr-only ">Choose profile photo</span>
              <input
                type="file"
                class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                onChange={onChangePicture}
                accept="image/png , image/jpg ,image/jpeg ,image/bmp"
              />
            </label>
          </div>
          <label className="text-white font-normal">Sample picture</label>

          <div class="shrink-0 my-2">
            <img
              class="h-60 w-60 object-cover rounded-lg bg-white"
              src={!picture ? `http://127.0.0.1:5000/uploads/${imgData}` : imgData}
            />

            <p class="text-yellow-500 my-1 text-xs italic font-normal">
              Size {picture ? (picture.size / 1024 / 1024).toFixed(2) : 0} MB
            </p>
          </div>
          <div className="flex justify-around mt-3 font-bold">
            <Link
              to="/profile"
              className="bg-sky-400 text-white px-5 py-2 rounded-lg text-center w-full mr-2 shadow-lg shadow-sky-900/50 hover:shadow-sky-500/40 hover:bg-sky-300"
            >
              Back
            </Link>
            <button className="bg-emerald-300 text-white px-5 py-2 rounded-lg text-center w-full shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/40 hover:bg-emerald-300">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
