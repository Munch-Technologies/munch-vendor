import {
  Button,
  ErrorButton,
  FullPageSpinner,
  ImageInput,
  Input,
  TextArea,
} from "components";
import { dequal } from "dequal";
import { LoadingSpinner } from "assets/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "context/AuthContext";
import apiAxios from "apis/apiAxios";

export default function AccountSettings() {
  const client = useClient();
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const [accountImage, setAccountImage] = useState();
  const [companyImage, setCompanyImage] = useState();

  const {
    data: accountSettings,
    isLoading: isAccountSettingsLoading,
    isError: isAccountSettingsError,
    error,
  } = useQuery(["settings", "account"], () => {
    return client("/admin/settings/account");
  });

  const { data: companySettings } = useQuery(["settings", "company"], () => {
    return client("/admin/settings/company");
  });

  // const companySettings = null;

  const {
    mutate: updateAccountSettings,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation(
    () => {
      let a, b;

      if (!dequal(accountSettings, accountSettingsData)) {
        // update account settings
        const formData = new FormData();
        for (let [key, value] of Object.entries(accountSettingsData)) {
          formData.append(key, value);
        }
        if (accountImage) {
          formData.append("media", accountImage);
        }
        // a = client("/admin/settings/account", {
        //   data: formData,
        //   method: "PATCH",
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        a = apiAxios.patch("/admin/settings/account", formData);
      }
      if (!dequal(companySettings, companySettingsData)) {
        // update company settings
        const formData = new FormData();
        for (let [key, value] of Object.entries(companySettingsData)) {
          formData.append(key, value);
        }
        if (companyImage) {
          formData.append("media", companyImage);
        }
        // b = client("/admin/settings/company", {
        //   data: formData,
        //   method: "PATCH",
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        b = apiAxios.patch("/admin/settings/company", formData);
      }

      if (a && b) {
        return Promise.all([a, b]);
      } else if (a) {
        return a;
      } else if (b) {
        return b;
      }
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["settings", "account"]);
        queryClient.invalidateQueries(["settings", "company"]);
        const user = await client("/admin/");
        updateUser(user);
      },
    }
  );

  // console.log("companySettings", companySettings);

  const [accountSettingsData, setAccountSettingsData] = useState();

  const [companySettingsData, setCompanySettingsData] = useState();

  useEffect(() => {
    setAccountSettingsData(accountSettings);
  }, [accountSettings]);

  useEffect(() => {
    setCompanySettingsData(companySettings);
  }, [companySettings]);

  const changed =
    (accountSettingsData && !dequal(accountSettings, accountSettingsData)) ||
    (companySettingsData && !dequal(companySettings, companySettingsData));

  const pushChangesToServer = () => {
    updateAccountSettings();
  };

  const saveAccountImageHandler = (image) => {
    setAccountImage(image);
    setAccountSettingsData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(image),
    }));
  };
  const setCompanyImageHandler = (image) => {
    setCompanyImage(image);
    setCompanySettingsData((prev) => ({
      ...prev,
      image: URL.createObjectURL(image),
    }));
  };

  if (isAccountSettingsError) throw error;
  if (isAccountSettingsLoading) {
    return <FullPageSpinner containerHeight="30rem" />;
  }

  return (
    <div className="card accountSettings">
      <div className="accountSettings__header">
        <h3 className="accountSettings__header-title">Account</h3>
        <div className="accountSettings__header-actions">
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

      <section className="accountSettings__section accountSettings__personal">
        <h4 className="accountSettings__section-header">Personal</h4>
        <ImageInput
          label="Profile Picture"
          currentImageUrl={
            accountSettingsData?.avatar ?? accountSettings.avatar
          }
          className="accountSettings__personal-pic"
          disabled={isUpdating}
          setImage={saveAccountImageHandler}
        />
        <div className="personal-info-wrap">
          <Input
            placeholder="Name"
            value={accountSettingsData?.name ?? accountSettings.name}
            onChange={(e) =>
              setAccountSettingsData((state) => ({
                ...state,
                name: e.target.value,
              }))
            }
            className="accountSettings__personal-name"
            disabled={isUpdating}
          />
          <Input
            placeholder="Phone No"
            value={accountSettingsData?.phone ?? accountSettings.phone}
            onChange={(e) =>
              setAccountSettingsData((state) => ({
                ...state,
                phone: e.target.value,
              }))
            }
            className="accountSettings__personal-phone"
            disabled={isUpdating}
          />
          <Input
            placeholder="Email"
            value={accountSettingsData?.email ?? accountSettings.email}
            onChange={(e) =>
              setAccountSettingsData((state) => ({
                ...state,
                email: e.target.value,
              }))
            }
            className="accountSettings__personal-email"
            disabled={isUpdating}
          />
          <Input
            placeholder="Change password"
            value={accountSettingsData?.password ?? ""}
            type="password"
            onChange={(e) =>
              setAccountSettingsData((state) => ({
                ...state,
                password: e.target.value,
              }))
            }
            className="accountSettings__personal-password"
            disabled={isUpdating}
          />
          <TextArea
            placeholder="Address"
            value={accountSettingsData?.address ?? accountSettings.address}
            onChange={(e) =>
              setAccountSettingsData((state) => ({
                ...state,
                address: e.target.value,
              }))
            }
            className="accountSettings__personal-address"
            disabled={isUpdating}
          />
        </div>
      </section>

      {companySettings && (
        <section className="accountSettings__section accountSettings__company">
          <h4 className="accountSettings__section-header">Company</h4>
          <ImageInput
            label="Company Logo"
            currentImageUrl={
              companySettingsData?.image ?? companySettings?.image
            }
            className="accountSettings__company-pic"
            disabled={isUpdating}
            setImage={setCompanyImageHandler}
          />
          <div className="company-info-wrap">
            <Input
              placeholder="Company Name"
              value={companySettingsData?.name ?? companySettings.name}
              onChange={(e) =>
                setCompanySettingsData((state) => ({
                  ...state,
                  name: e.target.value,
                }))
              }
              disabled={isUpdating}
              className="accountSettings__company-name"
            />
            <Input
              placeholder="Phone No"
              value={companySettingsData?.phone ?? companySettings.phone}
              onChange={(e) =>
                setCompanySettingsData((state) => ({
                  ...state,
                  phone: e.target.value,
                }))
              }
              disabled={isUpdating}
              className="accountSettings__company-phone"
            />
            <Input
              placeholder="Company Email"
              value={companySettingsData?.email ?? companySettings.email}
              onChange={(e) =>
                setCompanySettingsData((state) => ({
                  ...state,
                  email: e.target.value,
                }))
              }
              disabled={isUpdating}
              className="accountSettings__company-email"
            />
            <TextArea
              placeholder="Address"
              value={companySettingsData?.address ?? companySettings.address}
              onChange={(e) =>
                setCompanySettingsData((state) => ({
                  ...state,
                  address: e.target.value,
                }))
              }
              disabled={isUpdating}
              className="accountSettings__company-address"
            />
          </div>
        </section>
      )}
    </div>
  );
}
