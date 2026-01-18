import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup'
import { getError } from '@/utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'

interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmpassword: string
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
}

const RegisterScreen = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }: any = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const handleSubmit = async ({ name, email, password }: RegisterFormValues) => {
    try {
      await axios.post('/api/auth/signup', { name, email, password })

      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form
          className="
            mx-auto mt-16 max-w-md rounded-2xl p-8 shadow-lg
            bg-white text-gray-800
            dark:bg-gray-900 dark:text-gray-100
          "
        >
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Create Account
          </h1>

          {/* Username */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Username
            </label>

            <Field
              autoFocus
              type="text"
              name="name"
              placeholder="Your username"
              className="
                w-full rounded-lg border px-4 py-2 text-sm
                bg-white border-gray-300 text-gray-900
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200

                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30
              "
            />

            <ErrorMessage
              name="name"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </label>

            <Field
              type="email"
              name="email"
              placeholder="you@example.com"
              className="
                w-full rounded-lg border px-4 py-2 text-sm
                bg-white border-gray-300 text-gray-900
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200

                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30
              "
            />

            <ErrorMessage
              name="email"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password
            </label>

            <Field
              type="password"
              name="password"
              placeholder="••••••••"
              className="
                w-full rounded-lg border px-4 py-2 text-sm
                bg-white border-gray-300 text-gray-900
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200

                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30
              "
            />

            <ErrorMessage
              name="password"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Confirm Password
            </label>

            <Field
              type="password"
              name="confirmpassword"
              placeholder="••••••••"
              className="
                w-full rounded-lg border px-4 py-2 text-sm
                bg-white border-gray-300 text-gray-900
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200

                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30
              "
            />

            <ErrorMessage
              name="confirmpassword"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full rounded-lg py-2 text-sm font-semibold text-white
              bg-indigo-600 hover:bg-indigo-700 transition
              focus:outline-none focus:ring-2 focus:ring-indigo-400

              dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-500
            "
          >
            Register
          </button>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <Link
              className="ml-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              href={`/login?redirect=${redirect || '/'}`}
            >
              Login
            </Link>
          </p>
        </Form>
      </Formik>
    </>
  )
}

export default RegisterScreen
