import { LoadingSpinner } from "assets/icons";
import { Button, Card, Checkbox, Input, RadioGroup } from "components";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";

const allAccess = [
  "dashboard",
  "revenue",
  "restaurants",
  "menu",
  "orders",
  "riders",
  "customers",
  "sub-admins",
  "reviews",
  "settings",
  "promotions",
];

const UserModal = ({ closeModal }) => {
  const client = useClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState();
  const [access, setAccess] = useState([]);
  const queryClient = useQueryClient();

  const {
    mutate: mutateInvite,
    isLoading: isMutateLoading,
    isError: isMutateError,
  } = useMutation(
    (data) => {
      const formData = {
        role: role,
        name: name,
        email: email,
        access: role === "admin" ? [] : access,
      };
      return client(`/admin/sub-admin`, { data: formData, method: "POST" });
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.setQueryData(["admins"], (oldData) => {
          return [...oldData, { id: name, name, email, role, access }];
        });
        queryClient.invalidateQueries(["admins"]);
      },
    }
  );
  return (
    <Card className="newUser__modal">
      <div className="newUser__modal-header" style={{ textAlign: "center" }}>
        Invite Member
      </div>

      <Input
        className="newUser__modal-input"
        placeholder="Josiah Isong"
        label={"Name"}
        labelClassName="newUser__modal-label"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />

      <Input
        placeholder="xyz@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        className="newUser__modal-input"
        labelClassName="newUser__modal-label"
      />

      <RadioGroup
        label="Select role"
        name="initial role selector"
        options={[
          { name: "Admin", value: "admin" },
          { name: "Support", value: "support" },
          { name: "Marketing", value: "marketing" },
        ]}
        value={role}
        onChange={(value) => setRole(value)}
      />

      {role !== "admin" && (
        <div className="access">
          <span className="radioGroupLabel">User should have access to?</span>
          <div className="access-options">
            <Checkbox
              label="All"
              isChecked={access.length === 11}
              setIsChecked={(value) =>
                value ? setAccess(allAccess) : setAccess([])
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Dashboard"
              isChecked={access?.includes("dashboard")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "dashboard"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "dashboard")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Revenue"
              isChecked={access?.includes("revenue")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "revenue"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "revenue")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Restaurants"
              isChecked={access?.includes("restaurants")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "restaurants"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "restaurants")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Menu"
              isChecked={access?.includes("menu")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "menu"])
                  : setAccess((initial) => initial.filter((i) => i !== "menu"))
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Orders"
              isChecked={access?.includes("orders")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "orders"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "orders")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Riders"
              isChecked={access?.includes("riders")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "riders"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "riders")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Customers"
              isChecked={access?.includes("customers")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "customers"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "customers")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Sub-Admins"
              isChecked={access?.includes("sub-admins")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "sub-admins"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "sub-admins")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Reviews"
              isChecked={access?.includes("reviews")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "reviews"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "reviews")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Settings"
              isChecked={access?.includes("settings")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "settings"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "settings")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
            <Checkbox
              label="Promotions"
              isChecked={access?.includes("promotions")}
              setIsChecked={(value) =>
                value
                  ? setAccess((initial) => [...initial, "promotions"])
                  : setAccess((initial) =>
                      initial.filter((i) => i !== "promotions")
                    )
              }
              labelClassName="access-options__label"
              className={`access-options__checkbox `}
            />
          </div>
        </div>
      )}

      <div className="newUser__modal-footer">
        <Button
          className={"approve"}
          titleClass={"approve-text"}
          onClick={mutateInvite}
          title={isMutateError ? "Retry" : "Send Invite"}
          disabled={isMutateLoading}
          iconRight={isMutateLoading ? <LoadingSpinner /> : null}
        />
      </div>
    </Card>
  );
};

export default UserModal;
