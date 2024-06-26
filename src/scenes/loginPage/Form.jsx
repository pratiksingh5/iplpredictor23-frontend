import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { url } from "helper/url";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
// import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast } from 'react-toastify';

const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  instaUsername: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  // picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const forgotSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const changePasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  OTP: yup.number().required("required"),
  newPassword: yup.string().required("required"),
});

const initialValuesRegister = {
  name: "",
  instaUsername: "",
  email: "",
  password: "",
  // picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const initialValuesForgot = {
  email: ""
};
const initialValuesChangePassword = {
  email: "",
  OTP: "",
  newPassword: ""
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isForgot = pageType === "forgot";
  const isChangePassword = pageType === "change-password";


  const [incorrectPassword, setIncorrectPassword] = useState("");

  const register = async (values, onSubmitProps) => {
    try {
      // this allows us to send form info with image
      // const formData = new FormData();
      // for (let value in values) {
      //   formData.append(value, values[value]);
      // }
      // formData.append("picturePath", values.picture.name);


  
      // const savedUserResponse = await fetch(`${url}/auth/register`, {
      //   method: "POST",
      //   body: formData,
      // });

      const savedUserResponse = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
  
      if (!savedUserResponse.ok) {
        // Handle non-success responses
        const errorMessage = await savedUserResponse.text();
        throw new Error(errorMessage || 'Error registering user');
      }
  
      const savedUser = await savedUserResponse.json();
      toast.success('Account created successfully!');
      onSubmitProps.resetForm();
      console.log(savedUser);
      if (savedUser) {
        navigate("/home");
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      // Handle error (e.g., display error message to user)
      toast.error('Error creating account. Please try again later.');
    }
  };
  


  const forgot = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch(
      `${url}/auth/forgot`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const forgotUser = await savedUserResponse.json();
    setPageType("change-password")
    toast.success('OTP Sent! Please check your mail');
    onSubmitProps.resetForm();
    if(forgotUser){
      navigate("/login");
    }
  };

  const resetPassword = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch(
      `${url}/auth/resetPassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const forgotUser = await savedUserResponse.json();
    setPageType("login")
    toast.success('Password successfully changed! Login to continue');
    onSubmitProps.resetForm();
    if(forgotUser){
      navigate("/login");
    }
  };


  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    console.log(loggedIn);
    if (loggedIn.token) {
      onSubmitProps.resetForm();
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      toast.success('Login success!');
      navigate("/home");
    } else {
      setIncorrectPassword(loggedIn.msg);
    }
    // if (loggedIn) {
    //   dispatch(
    //     setLogin({
    //       user: loggedIn.user,
    //       token: loggedIn.token,
    //     })
    //   );
    //   navigate("/home");
    // }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isForgot) await forgot(values, onSubmitProps);
    if (isChangePassword) await resetPassword(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : isRegister ? initialValuesRegister : initialValuesForgot ? initialValuesForgot : initialValuesChangePassword}
      validationSchema={isLogin ? loginSchema : isRegister ? registerSchema : forgotSchema ? forgotSchema : changePasswordSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Insta Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.instaUsername}
                  name="instaUsername"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box> */}
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            {isForgot && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
           {isChangePassword && (
              <>
               <TextField
                  label="OTP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.OTP}
                  name="OTP"
                  error={Boolean(touched.OTP) && Boolean(errors.OTP)}
                  helperText={touched.OTP && errors.OTP}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />

               <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.newPassword}
                  name="newPassword"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
          </Box>
          {incorrectPassword && (
            <div style={{ color: "#c0392b", margin: "10px 0" }}>
              {incorrectPassword}
            </div>
          )}

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
              }}
              className="button"
            >
              {isLogin ? "LOGIN" : isRegister ? "register" : "forgot"}
            </Button>
            <FlexBetween>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                  setIncorrectPassword("");
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
              <Typography
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
                onClick={() => {
                  setPageType("forgot");
                  resetForm();
                  setIncorrectPassword("");
                }}
              >
                Forget Password
              </Typography>
            </FlexBetween>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
