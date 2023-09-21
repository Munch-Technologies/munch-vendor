import apiAxios from "apis/apiAxios";
import { ErrorButton, ToggleButtton } from "components";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";

export default function NotificationsSettings() {
  const client = useClient();
  const queryClient = useQueryClient();
  const {
    data: accountSettings,
    isLoading,
    isIdle,
    isError,
    error,
  } = useQuery(["settings", "account"], () => {
    return client("/admin/settings/account");
  });

  const {
    mutate: updateAccountSettings,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation(
    (data) => {
      // update account settings
      const formData = new FormData();
      formData.append("notification", data);

      return apiAxios.patch("/admin/settings/account", formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["settings", "account"]);
      },
      onError: () => {
        setOn(accountSettings.notification);
      },
    }
  );
  const [on, setOn] = useState(accountSettings?.notification);

  if (isError) throw error;
  return (
    <div className="card notificationsSettings">
      <h3 className="notificationsSettings__header">Notifications</h3>
      <div className="notificationsSettings__toggle">
        <span>Turn on post notification</span>
        <div>
          {isUpdateError && (
            <p className="error">
              <ErrorButton /> {updateError.message}
            </p>
          )}
          <ToggleButtton
            on={on}
            toggle={() => {
              setOn((o) => !o);
              updateAccountSettings(!on);
            }}
            disabled={isIdle || isLoading || isUpdating}
          />
        </div>
      </div>
    </div>
  );
}
