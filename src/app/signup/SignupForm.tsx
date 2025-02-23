import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaChevronDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import styles from "./styles/Signup.module.scss";
import GoogleSignup from "./GoogleSignup";

interface SignupFormState {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormState>({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const validateUsername = (username: string) =>
    /^[A-Za-z0-9_]+$/.test(username);
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password) &&
    !/\s/.test(password);

  const notify = (message: string, type: "success" | "error") => {
    toast[type](message, { position: "bottom-right", autoClose: 3000 });
  };

  //This will be working after the backend starts to make sure that the username is unique for everyone
  // const checkUsernameAvailability = async (username: string) => {
  //   setCheckingUsername(true);
  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/check-username", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username }),
  //     });
  //     const data = await res.json();
  //     if (res.ok && data?.available !== undefined) {
  //       setIsUsernameValid(data.available);
  //       if (!data.available) notify("Username already taken!", "error");
  //     } else {
  //       notify("Could not check username availability.", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error checking username:", error);
  //     notify("Could not check username availability.", "error");
  //   } finally {
  //     setCheckingUsername(false);
  //   }
  // };

  // const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);

  //the commented code is till here

  //this is the actual code for handle input change
  // const handleInputChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]:
  //         name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
  //     }));

  //      if (name === "username" && validateUsername(value)) {
  //        debouncedCheckUsername(value);
  //      }
  //    },
  //    [debouncedCheckUsername]
  // );

  //this is code we are using until we have a backend will be deleted later on
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
      }));

      // if (name === "username" && validateUsername(value)) {
      //   debouncedCheckUsername(value);
      // }
    },
    [setFormData] // Fixed the dependency array
  );

  //uncomment this code after adding backend
  // useEffect(() => {
  //   return () => debouncedCheckUsername.cancel();
  // }, []);

  const handleGenderSelection = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    setShowGenderDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      fullName,
      username,
      email,
      phone,
      gender,
      password,
      confirmPassword,
    } = formData;

    if (
      !fullName ||
      !username ||
      !email ||
      !phone ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      notify("Please fill all the fields.", "error");
      return;
    }
    if (!validateEmail(email)) {
      notify("Please enter a valid email address.", "error");
      return;
    }
    if (phone.length !== 10) {
      notify("Phone number must be exactly 10 digits.", "error");
      return;
    }
    if (!validatePassword(password)) {
      notify(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.",
        "error"
      );
      return;
    }
    if (password !== confirmPassword) {
      notify("Passwords do not match!", "error");
      return;
    }
    if (!isUsernameValid) {
      notify("Please choose a valid username.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const responseData = await res.json();
      if (res.ok) {
        notify("Signup successful!", "success");
        setFormData({
          fullName: "",
          username: "",
          email: "",
          phone: "",
          gender: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        notify(
          responseData?.message || "Registration failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      notify("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Sign Up</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            value={formData.fullName}
            style={{ color: "black" }}
            onChange={handleInputChange}
            type="text"
            placeholder="Full Name"
            required
          />
          <input
            name="username"
            value={formData.username}
            style={{ color: "black" }}
            onChange={handleInputChange}
            type="text"
            placeholder="Username"
            required
          />
          <input
            name="email"
            value={formData.email}
            style={{ color: "black" }}
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            style={{ color: "black" }}
            onChange={handleInputChange}
            type="tel"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            required
          />

          {/* Gender Selection */}
          <div className={styles.genderField} ref={dropdownRef}>
            <input
              name="gender"
              value={formData.gender}
              readOnly
              placeholder="Gender"
              className={styles.inputField}
              onClick={() => setShowGenderDropdown(!showGenderDropdown)}
            />
            <FaChevronDown
              className={styles.dropdownIcon}
              onClick={() => setShowGenderDropdown(!showGenderDropdown)}
            />
            {showGenderDropdown && (
              <ul className={styles.genderList}>
                {["Male", "Female"].map((genderOption) => (
                  <li
                    key={genderOption}
                    onClick={() => handleGenderSelection(genderOption)}
                  >
                    {genderOption}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Password Fields */}
          <div className={styles.passwordField}>
            <input
              name="password"
              value={formData.password}
              style={{ color: "black" }}
              onChange={handleInputChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className={styles.passwordField}>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              style={{ color: "black" }}
              onChange={handleInputChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div className={styles.googleSignUp}>
          <GoogleSignup />
        </div>

        <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Login
          </a>
        </p>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
