import { LoadingSpinner } from "assets/icons";
import { AdminAvatar } from "assets/images";
import {
  Accessdropdown,
  Button,
  ConfirmationModal,
  Image,
  RoleDropdown,
} from "components";
import { dequal } from "dequal";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";

const UsersRow = ({ user }) => {
  const [data, setData] = useState({ access: [], ...user });
  const [show, setShow] = useState(false);

  const queryClient = useQueryClient();
  const client = useClient();
  const currentChange = useRef();
  const {
    CustomModal: DeleteConfirmationModal,
    revealModal: revelDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    (task) => {
      if (currentChange.current === "delete") {
        // delete user
        return client(`/admin/sub-admin/${user.id}`, { method: "DELETE" });
      } else {
        // update user
        return client(`admin/sub-admin/${user.id}`, { data, method: "PATCH" });
      }
    },
    {
      onSuccess: (data, task) => {
        if (currentChange.current === "delete") {
          // delete user
          queryClient.setQueryData(["admins"], (oldData) => {
            return oldData.filter((item) => item.id !== user.id);
          });
        } else {
          // update user
          console.log("update success", data);
          queryClient.setQueryData(["admins"], (oldData) => {
            return oldData.map((item) => {
              if (item.id === data.id) {
                return data;
              }
              return item;
            });
          });
          hasNotChanged = true;
          setShow(false);
          queryClient.invalidateQueries(["admins"]);
        }
      },
    }
  );

  let hasNotChanged = dequal(data, { access: [], ...user });
  const cancelChanges = () => setData({ access: [], ...user });
  const saveChanges = () => {
    currentChange.current = "update";
    mutate();
  };
  const deleteUser = () => revelDeleteModal();

  return (
    <>
      <tr className="userrow">
        <DeleteConfirmationModal>
          <ConfirmationModal
            header="Delete Sub-Admin"
            message="Deleting this will remove the user from the system. Are you sure you want to delete this user?"
            onConfirm={() => {
              currentChange.current = "delete";
              mutate();
            }}
            closeModal={closeDeleteModal}
            confirmText="Delete"
            cancelText="Cancel"
            alert
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            error={error}
          />
        </DeleteConfirmationModal>
        <td>
          <div className="user">
            <Image src={data.avatar} alt="one of munch admins" />
            <div className="bodytext">{data.name}</div>
          </div>
        </td>
        <td>
          {data.role.toLowerCase() === "superadmin" ? (
            <span>Super Admin</span>
          ) : (
            <RoleDropdown
              className="subadmin-dropdown"
              status={data.role}
              setStatus={(status) =>
                setData((prevState) => ({ ...prevState, role: status }))
              }
            />
          )}
        </td>
        <td>
          {data.role.toLowerCase() === "superadmin" ? (
            <div className="subtext">All access</div>
          ) : data.role.toLowerCase() === "admin" ? (
            <div className="subtext">All access with control</div>
          ) : (
            <div className="access">
              <Accessdropdown
                access={data.access ?? []}
                setAccess={(access) => {
                  setData((prevState) => ({ ...prevState, access }));
                  setShow(true);
                }}
              />
            </div>
          )}
        </td>
        <td className="actions">
          {hasNotChanged ? (
            data.role.toLowerCase() !== "superadmin" && (
              <Button
                title={"Delete User"}
                className="delete"
                disabled={isLoading}
                iconLeft={
                  isLoading && currentChange.current === "delete" ? (
                    <LoadingSpinner />
                  ) : null
                }
                onClick={deleteUser}
              />
            )
          ) : (
            <>
              {show && (
                <>
                  <Button
                    title="Save Changes"
                    onClick={saveChanges}
                    className="save"
                    disabled={isLoading}
                    iconLeft={
                      isLoading && currentChange.current === "update" ? (
                        <LoadingSpinner />
                      ) : null
                    }
                  />
                  <Button
                    title="Cancel"
                    onClick={cancelChanges}
                    className="cancel"
                    disabled={isLoading}
                  />
                </>
              )}
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default UsersRow;
