import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LuUnlock } from "react-icons/lu";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../store/authSlice";

const SignUpPage = ({setSignUp}) => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Required"),
    profilePicture: Yup.mixed()
      .required("Required")
      .test(
        "fileSize",
        "File size is too large",
        (value) => value && value.size <= 1024 * 1024
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) => value && ["image/jpeg", "image/png"].includes(value.type)
      ),
  });
  

  const handleSubmit = async (values, { setSubmitting, setErrors,resetForm }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/auth/signup",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   console.log("Signup successful", response.data);
    //   localStorage.setItem("token", response.data.token);
    // } catch (error) {
    //   console.error("Signup error", error);
    //   setErrors({ email: "User already exists" });
    // }
    
    try{
      dispatch(signUp(formData));
      resetForm();
    }catch(error){
      console.error("Signup error", error);
      setErrors({ email: "User already exists" });
    }
    setSubmitting(false);
  };

  return (
    <div className="w-[600px] p-6 bg-white rounded-xl shadow-lg flex flex-col z-[10]">
      <div className="flex flex-row items-center text-xl font-bold gap-2 justify-center mb-2">
        <LuUnlock />
        <h2 className="text-2xl font-bold text-center">SignUp</h2>
      </div>
      <div className="flex flex-row items-center text-bold gap-2 justify-center mb-2">
          <p className="text-center">SignUp to Create a New Project</p>
          <LuLayoutDashboard className="text-2xl" />
        </div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          profilePicture: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
              className="w-full px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-sm text-red-600"
            />
            <div className="flex justify-between gap-4">
              <div className="w-1/2">
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="w-full px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="w-1/2">
                <Field
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <div className="w-1/2">
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="w-1/2">
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                onChange={(event) => {
                  setFieldValue("profilePicture", event.currentTarget.files[0]);
                }}
                className="w-[70%] px-3 py-2 h-12 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-300 h-12 w-[28%] rounded hover:bg-[#4959AC]"
              >
                <FaArrowRight className="m-auto text-white" />
              </button>
            </div>

            <ErrorMessage
              name="profilePicture"
              component="div"
              className="text-sm text-red-600"
            />
          </Form>
        )}
      </Formik>
      <div className="my-4 flex flex-row gap-2 justify-center">
        <h3>Already have an account?</h3>
        <button className="text-[#4959AC]" onClick={()=>(setSignUp(false))} >SignIn</button>
      </div>
    </div>
  );
};

export default SignUpPage;
