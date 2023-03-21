import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();

  const [data, setData] = useState("");
  useEffect(() => {
    const login = localStorage.getItem("login");
    console.log(login);
    if (parseInt(login) === 0) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    try {
      setData(JSON.parse(localStorage.getItem("data")));
    } catch {}
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const logoutFunc = () => {
    localStorage.setItem("login", 0);
    localStorage.setItem("data", "");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 h-screen w-full">
      <div className="bg-white flex flex-col justify-center">
        <form className="max-w-[700px] w-full mx-auto bg-indigo-900 p-10 px-8 rounded-lg">
          <h2 className="text-3xl dark:text-white font-bold text-center">
            Profile
          </h2>
          <div className="flex  text-indigo-900 py-2 font-semibold justify-center">
            <img
              class="h-60 w-60 object-cover rounded-lg bg-white"
              src={`http://127.0.0.1:5000/uploads/${data.profileImage}`}
            />
          </div>

          <div className="flex flex-col text-indigo-900 py-2 font-semibold">
            <label className="text-white font-normal">Username</label>
            <input
              className="cursor-not-allowed rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              value={data.username}
              disabled
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div className="flex flex-col text-indigo-900 py-2 font-semibold">
              <label className="text-white font-normal">Firstname</label>
              <input
                className="cursor-not-allowed rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                value={data.firstname}
                disabled
              />
            </div>
            <div className="flex flex-col text-indigo-900 py-2 font-semibold">
              <label className="text-white font-normal">Lastname</label>
              <input
                className=" cursor-not-allowed rounded-lg bg-gray-100 mt-2 p-2 focus:border-blue-600 focus:bg-gray-800 focus:outline-none focus:text-white"
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                value={data.lastname}
                disabled
              />
            </div>
          </div>

          <div className="flex  justify-around mt-3 font-bold">
            <Link
              to="/edit"
              className="bg-sky-400 text-white px-5 py-2 rounded-lg text-center w-full mr-2 shadow-lg shadow-sky-900/50 hover:shadow-sky-500/40 hover:bg-sky-300"
            >
              Edit Profile
            </Link>
            <button
              onClick={logoutFunc}
              className="bg-yellow-300 text-white px-5 py-2 rounded-lg text-center w-full shadow-lg shadow-yellow-900/50 hover:shadow-yellow-500/40 hover:bg-yellow-300"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
