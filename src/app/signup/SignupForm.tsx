"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./styles/Signup.module.scss";
import GoogleSignup from "./GoogleSignup";

export default function SignupForm() {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Username || !Email || !Phone || !Password || !ConfirmPassword) {
      alert("Please fill all the fields.");
      return;
    }

    if (Password !== ConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          Username,
          Email,
          Phone,
          Password,
          ConfirmPassword, // Include this
        }),
      });

      const responseData = await res.json();
      if (res.ok) {
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        alert("Signup successful!");
      } else {
        alert(responseData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            required
            style={{ color: "black" }}
            aria-label="Username"
          />
          <input
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            style={{ color: "black" }}
            aria-label="Email"
          />
          <input
            value={Phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            type="tel"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            required
            style={{ color: "black" }}
          />
          <div className={styles.passwordField}>
            <input
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              style={{ color: "black" }}
              aria-label="Password"
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
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              style={{ color: "black" }}
              aria-label="Confirm Password"
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
        <div
          style={{
            backgroundColor: "#4ea199",
            color: "black",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1em",
            textAlign: "center",
            margin: "10px 0",
            transition: "background-color 0.2s",
          }}
          className={styles.googleSignUp}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#01796f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4ea199")
          }
        >
          <GoogleSignup />
        </div>
        <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
