import { AdduserIcon } from "assets/icons";
import { Button, Card, ErrorContent, FullPageSpinner } from "components";
import React from "react";
import { useModal } from "utils/hooks";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import UsersRow from "./UsersRow";
import UserModal from "./UserModal";

const Users = () => {
  const client = useClient();

  const { CustomModal, revealModal, closeModal } = useModal();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: subadminData,
    refetch,
  } = useQuery(["admins"], () => client(`/admin/sub-admin`));

  // console.log("subadminData", subadminData);

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="40rem" />;
  }

  if (isError) {
    return <ErrorContent error={error} reset={refetch} />;
  }

  return (
    <>
      <CustomModal>
        <UserModal
          closeModal={() => {
            closeModal();
            refetch();
          }}
        />
      </CustomModal>

      <div className="users">
        <div className="users__header">
          <div className="users__header-text">Users</div>
          {/* {user.role === "Admin" && ( */}
          <Button
            className={"download-button"}
            title={"Invite Member"}
            iconLeft={<AdduserIcon />}
            onClick={revealModal}
          />
          {/* )} */}
        </div>
        <div className="table">
          <Card>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {subadminData.map((user) => (
                  <UsersRow user={user} key={user.id} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Users;
