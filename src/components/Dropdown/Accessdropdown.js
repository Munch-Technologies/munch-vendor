import { ChevronDown } from "assets/icons";
import Button from "components/Button/Button";
import Checkbox from "components/FormElements/Checkbox";
import React, { useState } from "react";
import { truncate } from "utils/truncate";

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

export default function Accessdropdown({
  access,
  setAccess,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${className} accessdropdown roleDropdown`}
      tabIndex={0}
      // onBlur={() => setIsOpen(false)}
      {...props}
    >
      <Button
        onClick={() => setIsOpen((o) => !o)}
        titleClass={`roleDropdown-title`}
        className={`roleDropdown-button accessdropdown-button`}
        title={truncate(access?.join(", "), 20) || "Select access"}
        iconRight={<ChevronDown />}
      />
      {isOpen && (
        <ul
          className="access-options"
          onMouseLeave={() => setIsOpen((o) => !o)}
        >
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
                ? setAccess([...access, "dashboard"])
                : setAccess(access.filter((i) => i !== "dashboard"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Revenue"
            isChecked={access?.includes("revenue")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "revenue"])
                : setAccess(access.filter((i) => i !== "revenue"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Restaurants"
            isChecked={access?.includes("restaurants")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "restaurants"])
                : setAccess(access.filter((i) => i !== "restaurants"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Menu"
            isChecked={access?.includes("menu")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "menu"])
                : setAccess(access.filter((i) => i !== "menu"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Orders"
            isChecked={access?.includes("orders")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "orders"])
                : setAccess(access.filter((i) => i !== "orders"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Riders"
            isChecked={access?.includes("riders")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "riders"])
                : setAccess(access.filter((i) => i !== "riders"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Customers"
            isChecked={access?.includes("customers")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "customers"])
                : setAccess(access.filter((i) => i !== "customers"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Sub-Admins"
            isChecked={access?.includes("sub-admins")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "sub-admins"])
                : setAccess(access.filter((i) => i !== "sub-admins"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Reviews"
            isChecked={access?.includes("reviews")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "reviews"])
                : setAccess(access.filter((i) => i !== "reviews"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Settings"
            isChecked={access?.includes("settings")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "settings"])
                : setAccess(access.filter((i) => i !== "settings"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
          <Checkbox
            label="Promotions"
            isChecked={access?.includes("promotions")}
            setIsChecked={(value) =>
              value
                ? setAccess([...access, "promotions"])
                : setAccess(access.filter((i) => i !== "promotions"))
            }
            labelClassName="access-options__label"
            className={`access-options__checkbox `}
          />
        </ul>
      )}
    </div>
  );
}
