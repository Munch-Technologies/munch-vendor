import React from "react";
import { useNavigate } from "react-router-dom";
import getTimeAgo from "utils/timeAgo";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Card, FullPageSpinner } from "components";
import { useClient } from "utils/apiClient";
import ReadNotifications from "./ReadNotifications.js";
import generateLink from "utils/generateLink.js";
import { useRef } from "react";

export default function Notifications() {
  const client = useClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unreadNotifications, isLoading: isUnreadNotificationsLoading } =
    useQuery(["unreadNotifications"], () => {
      return client("admin/notification");
    });

  const { mutate } = useMutation(
    () => {
      console.log("data", selectedItem.current);
      if (selectedItem.current) {
        // mark single notification as read
        return client(`admin/notification/${selectedItem.current}/read`, {
          method: "PATCH",
        });
      } else {
        // mark all notifications as read
        return client("/admin/notification/read", {
          method: "PATCH",
        });
      }
    },
    {
      onMutate: (data) => {
        if (selectedItem.current) {
          queryClient.setQueryData(["unreadNotifications"], (oldData) => {
            return oldData.filter((item) => item.id !== data);
          });
        } else {
          queryClient.setQueryData(["unreadNotifications"], (oldData) => {
            return { ...oldData, notification: null };
          });
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["unreadNotifications"]);
        queryClient.invalidateQueries(["allNotifications"], {
          refetchPage: (page, index) => index === 0,
        });
      },
    }
  );

  // console.log("unreadNotifications", unreadNotifications);

  // const markAsRead = (id) => {
  //   console.log("id", id);
  // };

  const selectedItem = useRef(null);

  const markAllAsRead = () => {
    selectedItem.current = null;
    mutate();
  };

  return (
    <div className="notifications">
      {unreadNotifications?.length && (
        <div className="notifications__unread">
          <div className="notifications__unread-header">
            <h2 className="notifications__unread-header-title">
              Unread Notifications
            </h2>
            <button
              className="notifications__unread-header-button"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </button>
          </div>
          <div className="notifications__unread-list">
            {isUnreadNotificationsLoading ? (
              <Card style={{ margin: "2rem 0" }}>
                <FullPageSpinner containerHeight="20rem" />
              </Card>
            ) : (
              <>
                {unreadNotifications?.map((notification) => (
                  <div
                    className="notification-item unread"
                    key={notification.id}
                  >
                    <span className="notification-item-indicator"></span>
                    <p className="notification-item-time">
                      {getTimeAgo(new Date(notification.created_at))}
                    </p>
                    <p
                      className={`notification-item-message ${
                        notification.has_link && "link"
                      }`}
                      onClick={() => {
                        if (notification.has_link) {
                          let path = generateLink(notification.link_meta);
                          navigate(path);
                        }
                      }}
                    >
                      {notification.message}
                    </p>
                    <div className="notification-item-actions">
                      <button
                        className="notification-item-cta"
                        onClick={() => {
                          selectedItem.current = notification.id;
                          mutate();
                        }}
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      <div className="notifications__other">
        <h2 className="notifications__other-header">Others</h2>
        {/* <div className="notifications__other-list">
          {isOtherNotificationsLoading ? (
            <Card style={{ margin: "2rem 0" }}>
              <FullPageSpinner containerHeight="20rem" />
            </Card>
          ) : (
            <>
              {otherNotifications?.notification?.map((notification) =>
                notification.has_link ? (
                  <Link key={notification.id} to="/">
                    <div className="notification-item">
                      <p className="notification-item-time">
                        {getTimeAgo(new Date(notification.created_at))}
                      </p>
                      <p className="notification-item-message">
                        {notification.message}
                      </p>
                      {notification.cta && (
                        <button className="notification-item-cta">
                          {notification.cta}
                        </button>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="notification-item" key={notification.id}>
                    <p className="notification-item-time">
                      {getTimeAgo(new Date(notification.created_at))}
                    </p>
                    <p className="notification-item-message">
                      {notification.message}
                    </p>
                    {notification.cta && (
                      <button className="notification-item-cta">
                        {notification.cta}
                      </button>
                    )}
                  </div>
                )
              )}
            </>
          )}
        </div> */}
        <ReadNotifications />
      </div>

      {/* <ReadNotifications /> */}
    </div>
  );
}
