import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyPayment } from "../Api/paymentApi.js";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!sessionId) {
        setStatus("error");
        setMessage("Invalid payment session.");
        return;
      }

      try {
        const response = await verifyPayment(sessionId);
        if (response.success) {
          setStatus("success");
          if (response.purchase?.alreadyPurchased) {
            setMessage(
              "You already have access to this course! The payment was processed, but you were already enrolled."
            );
          } else {
            setMessage(
              "Payment completed successfully! You now have access to the course."
            );
          }

          // Progress bar countdown
          let value = 0;
          const timer = setInterval(() => {
            value += 1;
            setProgress(value);
            if (value >= 100) clearInterval(timer);
          }, 30);

          // Redirect after 3 seconds
          setTimeout(() => {
            if (courseId) navigate(`/course/${courseId}/learn`);
            else navigate("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        const errorMessage =
          error.details?.message ||
          error.message ||
          "Failed to verify payment. Please contact support.";
        const errorStatus = error.status;

        if (errorStatus === 401) {
          setMessage("Authentication failed. Please log in and try again.");
        } else if (errorStatus === 400) {
          setMessage(`Payment verification failed: ${errorMessage}`);
        } else {
          setMessage(errorMessage);
        }
      }
    };

    verifyPaymentStatus();
  }, [sessionId, courseId, navigate]);

  const handleReturnHome = () => navigate("/");
  const handleGoToCourse = () =>
    courseId ? navigate(`/course/${courseId}/learn`) : navigate("/dashboard");

  const renderStatusIcon = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        );
      case "success":
        return (
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center shadow-2xl"
        >
          {renderStatusIcon()}

          <h3 className="text-2xl font-semibold text-white mb-2">
            {status === "loading"
              ? "Verifying Payment..."
              : status === "success"
              ? "Payment Successful!"
              : "Payment Error"}
          </h3>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>

          {status === "loading" && (
            <p className="text-xs text-slate-500">
              Please wait while we confirm your payment...
            </p>
          )}

          {status === "success" && (
            <>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden mb-5">
                <motion.div
                  className="bg-green-500 h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleGoToCourse}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Go to Course
                </button>
                <button
                  onClick={handleReturnHome}
                  className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-medium"
                >
                  Return Home
                </button>
              </div>
            </>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={handleReturnHome}
                className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-medium"
              >
                Return Home
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentSuccess;
