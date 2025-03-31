import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import api from '../utils/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [message, setMessage] = useState("Đang xác thực...");
    const [countdown, setCountdown] = useState(4);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/auth/verify-email', { params: { token } })
                .then((response) => {
                    setLoading(false);
                    if (response.data.message.includes("Xác thực email thành công")) {
                        setMessage("Xác thực email thành công! Bạn sẽ được chuyển hướng sau:");
                        setIsSuccess(true);
                    } else {
                        setMessage("Token không hợp lệ hoặc đã hết hạn.");
                        setIsSuccess(false);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setMessage("Lỗi kết nối đến server.");
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
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            {/* Thêm thông báo lớn */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    color: isSuccess ? "#008000" : "#993300",
                    textAlign: "center",
                    mb: 2,
                }}
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {isSuccess ? "Xác Thực Thành Công" : " Xác Thực Email"}
            </Typography>

            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    border: "2px solid #993300",
                    backgroundColor: "white",
                    width: "400px",
                }}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#993300", mb: 2 }}
                >
                    Xác Thực Email
                </Typography>

                {loading ? (
                    <CircularProgress sx={{ color: "#993300" }} />
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem" }}>
                            {message}
                        </Typography>

                        {isSuccess && (
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1rem", color: "#993300", fontWeight: "bold" }}
                            >
                                Chuyển hướng trong {countdown} giây...
                            </Typography>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default VerifyEmail;
