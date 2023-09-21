import React from "react";

export default function FallbackResultCard({ className = "", ...props }) {
  return <div className={`fallbackCard ${className}`} {...props} />;
}
