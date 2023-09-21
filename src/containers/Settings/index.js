import {
  GeneralSettingsIcon,
  Notification,
  PriorityIcon,
  SettingsIcon2,
  UserIcon,
} from "assets/icons";
import { ErrorContent } from "components";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AccountSettings from "./AccountSettings";
import GeneralSettings from "./GeneralSettings";
import NotificationsSettings from "./NotificationsSettings";
import RestaurantsSettings from "./RestaurantsSettings";
import SendSettings from "./SendSettings";

const Settings = () => {
  const [settings, setSettings] = useState("account");

  const setActiveSetting = (value) => {
    // animate active box to position
    setSettings(value);
  };
  return (
    <div className="settings">
      <h2 className="settings__title">Settings</h2>

      <div className="settings__content">
        <ul className="settings__nav">
          <li
            className={`settings__nav-item ${
              settings === "account" ? "active" : ""
            }`}
            onClick={() => setActiveSetting("account")}
          >
            <UserIcon />
            <p className="settings__nav-item-title">Account</p>
            <p className="settings__nav-item-description">
              Manange your personal and company account
            </p>
          </li>
          <li
            className={`settings__nav-item ${
              settings === "general" ? "active" : ""
            }`}
            onClick={() => setActiveSetting("general")}
          >
            <GeneralSettingsIcon />
            <p className="settings__nav-item-title">General</p>
            <p className="settings__nav-item-description">
              Make edits to tax values, delivery charges, site commission etc.
            </p>
          </li>
          <li
            className={`settings__nav-item ${
              settings === "restaurants" ? "active" : ""
            }`}
            onClick={() => setActiveSetting("restaurants")}
          >
            <PriorityIcon />
            <p className="settings__nav-item-title">Restaurant Priority</p>
            <p className="settings__nav-item-description">
              Set restaurant priority for users
            </p>
          </li>
          <li
            className={`settings__nav-item ${
              settings === "send" ? "active" : ""
            }`}
            onClick={() => setActiveSetting("send")}
          >
            <SettingsIcon2 />
            <p className="settings__nav-item-title">Send Email/Notifications</p>
            <p className="settings__nav-item-description">
              Send email or push notifications to rider, consumers and
              restaurants
            </p>
          </li>
          <li
            className={`settings__nav-item ${
              settings === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveSetting("notifications")}
          >
            <Notification />
            <p className="settings__nav-item-title">Notifications</p>
            <p className="settings__nav-item-description">
              Customize the way you want to receive your notifications.
            </p>
          </li>
        </ul>
        <ErrorBoundary
          FallbackComponent={ErrorContent}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}
          resetKeys={[settings]}
        >
          {settings === "account" ? (
            <AccountSettings />
          ) : settings === "general" ? (
            <GeneralSettings />
          ) : settings === "restaurants" ? (
            <RestaurantsSettings />
          ) : settings === "send" ? (
            <SendSettings />
          ) : settings === "notifications" ? (
            <NotificationsSettings />
          ) : (
            "This should be immpossible"
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Settings;
