import React from 'react'
import { useForm } from 'react-hook-form'
import { json } from 'react-router-dom'

const Test = () => {
  const {
    register,handleSubmit,formState: { errors },} = useForm()

  // Form submission handler
  const onSubmit = (data) => {
    // Do something with the form data
    console.log(`data ${ JSON.stringify(data) }`)
  }

  return (<div className='flex bg-white h-screen'>
    <div className="m-auto flex w-80  flex-col gap-4 justify-center">
      <h1 className="bold text-2xl underline">Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="input-wrapper flex flex-col">
          <label htmlFor="username">User</label>
          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            })}
            
          />
          {errors.username && (
            <p className="text-xs italic text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="input-wrapper flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-xs italic text-red-500">{errors.email.message}</p>}
        </div>

        <div className="input-wrapper flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          {errors.password && (
            <p className="text-xs italic text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>

  )
}

export default Test
