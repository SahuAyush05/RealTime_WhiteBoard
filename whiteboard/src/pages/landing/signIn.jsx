import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LuUnlock } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/authSlice";
//import { notification, Space } from 'antd';


const LoginPage = ({ setSignUp }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  //Notification
  // const [api, contextHolder] = notification.useNotification();

  // useEffect(() => {
  //   if (status === "succeeded") {
  //     api.success({
  //       message: "Login Successful",
  //       description: "You have logged in successfully.",
  //     });
  //   } else if (status === "failed") {
  //     api.error({
  //       message: "Login Failed",
  //       description: error || "Invalid credentials. Please try again.",
  //     });
  //   }
  // }, [status, error, api]);
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors,resetForm }) => {
    try {
      await dispatch(signIn(values));
      resetForm();
    } catch (error) {
      console.error("Login error", error);
      setErrors({
        email: "Invalid credentials",
        password: "Invalid credentials",
      });
    }
    setSubmitting(false);
    
  };

  return (
    <div className="w-[400px] h-[300px] p-4 space-y-8 bg-white rounded-xl shadow-lg flex flex-row z-[10]">
      <div className="w-full">
        <div className="flex flex-row items-center text-xl text-bold gap-2 justify-center m-2">
          <LuUnlock />
          <h2 className="text-2xl font-bold text-center ">SignIn</h2>
        </div>
        <div className="flex flex-row items-center text-bold gap-2 justify-center m-2">
          <p className="text-center">Login to Create a New Project</p>
          <LuLayoutDashboard className="text-2xl" />
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-3 py-2 mt-1 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="E-mail"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[80%] ">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="w-full px-3 h-12 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <div className="w-[20%] h-12 mt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-300 h-12 w-full rounded hover:bg-[#4959AC]"
                  >
                    <FaArrowRight className="m-auto text-white" />
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <div className="my-4 flex flex-row gap-2 justify-center">
          <h3>Didn't have account?</h3>
          <button className="text-[#4959AC]" onClick={() => setSignUp(true)}>
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
