import React, { useEffect, useRef, useState } from "react";
import { Calendar, Notification } from "assets/icons";
import { capitalizeFirstLetter } from "utils/capitalize";
import { useActiveRoute } from "utils/hooks";
import { useAuth } from "context/AuthContext";
import BreadCrumbs from "./BreadCrumbs";
import { Link, useNavigate } from "react-router-dom";
import Image from "components/Image";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
// import { useClient } from "utils/apiClient";

const Header = () => {
  const client = useClient();
  const navigate = useNavigate();
  const { activePath, routes } = useActiveRoute("dashboard");
  const [date] = useState(() =>
    new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    () => {
      // mark all notifications as read
      return client("/admin/notification/read");
    },
    {
      onMutate: async (data) => {
        queryClient.setQueryData(["unreadNotifications"], (oldData) => {
          return null;
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["unreadNotifications"]);
      },
    }
  );

  const [showCard, setShowCard] = useState(false);

  const notificationsWrap = useRef(null);
  const notificationsCard = useRef(null);
  const cursorIn = useRef(false);

  const markAllAsRead = () => {
    mutate();
  };

  const { user } = useAuth();

  const { data: notifications } = useQuery(["unreadNotifications"], () => {
    return client("admin/notification");
  });

  const notificationRefetch = useRef();

  useEffect(() => {
    if (notificationRefetch.current) {
      clearInterval(notificationRefetch.current);
    }

    notificationRefetch.current = setInterval(() => {
      queryClient.invalidateQueries(["unreadNotifications"]);
    }, 5 * 60 * 1000);
  }, [queryClient]);

  return (
    <header className="header">
      <div className="header__pageName">
        {routes.length > 1 ? (
          <BreadCrumbs routes={routes} />
        ) : (
          <h1>{capitalizeFirstLetter(activePath)}</h1>
        )}
      </div>
      <div className="header__user">
        <div
          tabIndex="0"
          ref={notificationsWrap}
          className="header__user-notification"
          onMouseEnter={() => {
            cursorIn.current = true;
            setShowCard(true);
          }}
          onMouseLeave={() => {
            cursorIn.current = false;
            setTimeout(() => {
              if (!cursorIn.current) setShowCard(false);
            }, 300);
          }}
          onClick={() => {
            navigate("/notifications");
          }}
        >
          {notifications?.length > 0 && (
            <>
              <span className="header__user-notification-indicator"></span>
              {showCard && (
                <div
                  tabIndex="0"
                  ref={notificationsCard}
                  className="card header__user-notification-card"
                  onMouseEnter={() => {
                    cursorIn.current = true;
                    setShowCard(true);
                  }}
                  onMouseLeave={() => {
                    cursorIn.current = false;
                    setTimeout(() => {
                      if (!cursorIn.current) setShowCard(false);
                    }, 300);
                  }}
                >
                  <div className="actions">
                    <button
                      className="actions-mark"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <Link to="/notifications">
                    {notifications?.map((notification, index) =>
                      index < 3 ? (
                        <p className="header__user-notification-card-item">
                          {notification.message}
                        </p>
                      ) : null
                    )}

                    {notifications?.length > 3 && (
                      <p className="header__user-notification-card-more">
                        +{notifications.length - 3} more notifications
                      </p>
                    )}
                  </Link>
                </div>
              )}
            </>
          )}
          <Notification />
        </div>
        <Link to="/settings">
          <Image
            className="header__user-image"
            src={user.avatar}
            alt="profile pics"
          />
        </Link>
        <div className="header__user-welcome">
          <h2 className="header__user-welcome-greeting">
            Welcome Back, {capitalizeFirstLetter(user.name)}
          </h2>
          <div className="header__user-welcome-date">
            <div>
              {" "}
              <Calendar />
            </div>
            <h4>{date}</h4>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
