import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang xác thực...");
  const [countdown, setCountdown] = useState(4);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:9000/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.message.includes("Xác thực email thành công")) {
            setMessage(" Xác thực email thành công! Bạn sẽ được chuyển hướng sau:");
            setIsSuccess(true);
          } else {
            setMessage(" Token không hợp lệ hoặc đã hết hạn.");
            setIsSuccess(false);
          }
        })
        .catch(() => {
          setMessage(" Lỗi kết nối đến server.");
          setIsSuccess(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate("/login");
    }
  }, [countdown, isSuccess, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
      {isSuccess && <p>Chuyển hướng trong {countdown} giây...</p>}
    </div>
  );
};

export default VerifyEmail;
