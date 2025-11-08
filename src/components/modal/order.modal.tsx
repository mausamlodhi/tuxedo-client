"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy } from "lucide-react";
import { setActiveSidebar } from "@/app/redux/slice/auth.slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string;
  amount?: number | string;
  onViewOrder?: (orderId: string) => void;
};

export default function OrderSuccessModal({
  open,
  onClose,
  orderId,
  amount,
  onViewOrder,
}: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [animateUp, setAnimateUp] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setShowDetails(false);
      setAnimateUp(false);
      setCopied(false);


      const moveUpTimer = setTimeout(() => setAnimateUp(true), 10);

      // Show details after animation completes (0.6s)
      const detailsTimer = setTimeout(() => setShowDetails(true), 600);

      return () => {
        clearTimeout(moveUpTimer);
        clearTimeout(detailsTimer);
      };
    }
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);

    } catch {
      alert("Unable to copy. Please copy manually.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(4px)" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden
          />

          {/* Popup */}
          <motion.div
            key="content"
            className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl p-6 md:p-8 overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 rounded-full p-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Main content container */}
            <div className="min-h-[400px] flex flex-col">
              {/* ✅ Animated checkmark container */}
              <motion.div
                className="flex-1 flex flex-col items-center justify-center"
                animate={{
                  y: animateUp ? -20 : 0,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#d4a077] to-[#b78245] flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <motion.svg
                    viewBox="0 0 48 48"
                    className="w-10 h-10 text-white"
                    initial={{
                      rotate: -15,
                      strokeDasharray: "100",
                      strokeDashoffset: 100,
                    }}
                    animate={{
                      rotate: 0,
                      strokeDashoffset: 0,
                    }}
                    transition={{
                      rotate: {
                        type: "spring",
                        stiffness: 200,
                        delay: 0.4,
                      },
                      strokeDashoffset: {
                        duration: 1.2,
                        ease: "easeOut",
                        delay: 0.2,
                      },
                    }}
                  >
                    <path
                      d="M12 24 L20 32 L36 14"
                      fill="transparent"
                      stroke="#fff"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>

                <motion.p
                  className="mt-4 text-gray-800 text-lg font-semibold text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1,
                    duration: 0.4,
                  }}
                >
                  Checkout successfully!
                </motion.p>
              </motion.div>

              {/* ✅ Order Details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    key="details"
                    className="flex-shrink-0"
                    initial={{
                      opacity: 0,
                      y: 40,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  >
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Order ID
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="font-mono text-sm text-gray-800 break-all">
                              {orderId}
                            </p>
                            <button
                              onClick={handleCopy}
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs border rounded transition cursor-pointer ${copied
                                  ? "border-green-400 bg-green-50 text-green-700"
                                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                }`}
                              aria-label="Copy order ID"
                            >
                              {copied ? (
                                <motion.svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 text-green-600"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 12,
                                  }}
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </motion.svg>
                              ) : (
                                <Copy size={14} />
                              )}
                              <span>{copied ? "Copied!" : "Copy"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {amount !== undefined && (
                        <div className="mt-4 border-t border-gray-100 pt-3">
                          <p className="text-xs text-gray-500">Amount paid</p>
                          <div className="mt-1 text-lg font-semibold text-gray-800">
                            {typeof amount === "number"
                              ? `₹ ${amount.toFixed(2)}`
                              : amount}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => {
                          dispatch(setActiveSidebar("events"))
                          router.push("/my-account");
                        }}
                        className="px-4 py-2 rounded-lg bg-[#d4a077] text-white text-sm font-medium hover:bg-[#c28150] transition cursor-pointer"
                      >
                        View order
                      </button>

                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-400">
                      Need help? Contact support with your Order ID.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
