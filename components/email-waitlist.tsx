'use client';

import { useState } from 'react';
import ShinyButton from "@/components/ui/shiny-button";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

export default function EmailWaitlist() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setMessage('Thank you for joining our waitlist!');
        setEmail('');
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleJoinWaitlist = () => {
    setShowEmailInput(true);
  };

  const handleSubscribeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  return (
    <div className="max-w-md w-full">
      {!showEmailInput ? (
        <div onClick={handleJoinWaitlist}>
          <ShinyButton className="w-full max-w-md">
            Join the Waitlist
          </ShinyButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-grow px-4 py-2 border rounded-md"
            />
            <AnimatedSubscribeButton
              buttonColor="hsl(var(--primary))"
              buttonTextColor="hsl(var(--primary-foreground))"
              subscribeStatus={isSubmitted}
              initialText={
                <span className="group inline-flex items-center">
                  Subscribe{" "}
                  <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              }
              changeText={
                <span className="group inline-flex items-center">
                  <CheckIcon className="mr-2 size-4" />
                  Subscribed{" "}
                </span>
              }
              disabled={!email}
              onClick={handleSubscribeClick}
            />
          </div>
          {message && <p className="mt-4 text-center">{message}</p>}
        </form>
      )}
    </div>
  );
}
