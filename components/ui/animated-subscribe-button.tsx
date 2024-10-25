"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedSubscribeButtonProps {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor,
  changeText,
  initialText,
  disabled = false,
  onClick,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setIsSubscribed(true);
      onClick?.(e);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        className="relative flex items-center justify-center overflow-hidden rounded-md p-[10px]"
        style={{ 
          backgroundColor: disabled ? 'gray' : buttonColor, 
          color: buttonTextColor,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onClick={handleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        disabled={disabled}
      >
        <motion.span
          key={isSubscribed ? "subscribed" : "subscribe"}
          className="relative block font-semibold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isSubscribed ? changeText : initialText}
        </motion.span>
      </motion.button>
    </AnimatePresence>
  );
};
