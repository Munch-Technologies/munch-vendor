import { useAuth } from "context/AuthContext";
import React from "react";

export default function Image({ src, alt, className, ...props }) {
  const { user } = useAuth();
  const avatarImage =
    user.avatar === "link.to.some.avatar"
      ? `https://icons.veryicon.com/png/o/education-technology/alibaba-big-data-oneui/user-profile.png`
      : src;
  return (
    <div
      className={`image ${className}`}
      role="img"
      aria-label={alt}
      title={alt}
      style={{
        backgroundImage: `url("${avatarImage}")`,
      }}
      {...props}
    ></div>
  );
}
