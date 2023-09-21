import { LoadingSpinner } from "assets/icons";
import {
  Button,
  DropdownInput,
  ErrorButton,
  FullPageSpinner,
  Input,
} from "components";
import { dequal } from "dequal";
import React, { useState } from "react";
import data from "assets/dummyData/dateAndTimeFormats";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { useEffect } from "react";

export default function GeneralSettings() {
  const client = useClient();
  const queryClient = useQueryClient();

  const {
    data: generalSettings,
    isLoading: isGeneralSettingsLoading,
    isError: isGeneralSettingsError,
    error,
  } = useQuery(["settings", "general"], () => {
    return client("/admin/settings/general");
  });
  const [generalSettingsData, setGeneralSettingsData] = useState();

  const {
    mutate: updateGeneralSettings,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation(
    () => {
      return client("/admin/settings/general", {
        data: generalSettingsData,
        method: "PATCH",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["settings", "general"]);
      },
    }
  );

  useEffect(() => {
    setGeneralSettingsData(generalSettings);
  }, [generalSettings]);

  const setData = (property, value) => {
    setGeneralSettingsData((prevState) => ({
      ...prevState,
      [property]: value,
    }));
  };

  const changed = !dequal(generalSettings, generalSettingsData);

  const pushChangesToServer = () => {
    updateGeneralSettings();
  };

  if (isGeneralSettingsError) throw error;
  if (isGeneralSettingsLoading) {
    return <FullPageSpinner containerHeight="30rem" />;
  }

  return (
    <div className="card generalSettings">
      <div className="generalSettings__header">
        <h3 className="generalSettings__header-title">General</h3>
        <div className="generalSettings__header-actions">
          {isUpdateError && (
            <p className="error">
              <ErrorButton /> {updateError.message}
            </p>
          )}
          <Button
            title="Save Changes"
            disabled={!changed || isUpdating}
            onClick={pushChangesToServer}
            iconRight={isUpdating ? <LoadingSpinner /> : null}
          />
        </div>
      </div>
      <section className="generalSettings__section">
        <div className="info-wrap">
          <Input
            placeholder="Set Tax Value"
            value={generalSettingsData?.tax}
            onChange={(e) => setData("tax", e.target.value)}
            disabled={isUpdating}
          />
          <Input
            placeholder="Set Delivery Charges"
            value={generalSettingsData?.delivery_charges}
            onChange={(e) => setData("delivery_charges", e.target.value)}
            disabled={isUpdating}
          />
          <Input
            placeholder="Set restaurant commission"
            value={generalSettingsData?.commission}
            onChange={(e) => setData("commission", e.target.value)}
            disabled={isUpdating}
          />
        </div>
      </section>
      <section className="generalSettings__section">
        <h4 className="generalSettings__section-header">
          Time and Date Format
        </h4>
        <div className="info-wrap">
          <DropdownInput
            label="Date Format"
            value={generalSettingsData?.date_format}
            onSelect={(value) => setData("date_format", value)}
            list={data.dateFormats}
            className="generalSettings__section-dropdown"
            disabled={isUpdating}
          />
          <DropdownInput
            label="Time Format"
            value={generalSettingsData?.time_format}
            onSelect={(value) => setData("time_format", value)}
            list={data.timeFormats}
            className="generalSettings__section-dropdown"
            disabled={isUpdating}
          />
        </div>
      </section>
    </div>
  );
}
