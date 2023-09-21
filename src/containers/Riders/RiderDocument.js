import { FolderIcon, LoadingSpinner, PlusIcon, ThreeDot } from "assets/icons";
import {
  Button,
  Card,
  ConfirmationModal,
  CustomDropdown,
  DocumentModal,
  FallbackResultCard,
  SelectableTagList,
  StatusPill,
} from "components";
import produce from "immer";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";

const documentRejectionReasons = [
  "File is corrupted",
  "Insufficient details",
  "Wrong document",
];

const RiderDocument = ({ documents }) => {
  const { riderId } = useParams();
  const { CustomModal, revealModal, closeModal } = useModal();
  const [rejectionReasons, setRejectionReasons] = useState([]);

  const client = useClient();

  const {
    CustomModal: ApproveDocumentModal,
    revealModal: revealApproveDocumentModal,
    closeModal: closeApproveDocumentModal,
  } = useModal();
  const {
    CustomModal: RejectDocumentModal,
    revealModal: revealRejectDocumentModal,
    closeModal: closeRejectDocumentModal,
  } = useModal();
  const {
    CustomModal: DeleteDocumentModal,
    revealModal: revealDeleteDocumentModal,
    closeModal: closeDeleteDocumentModal,
  } = useModal();

  const change = useRef({});

  const queryClient = useQueryClient();
  const selectedDocument = useRef();

  const {
    mutate,
    isLoading: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
    isSuccess: isMutationSuccess,
  } = useMutation(
    (data) => {
      if (
        change.current.action === "approve" ||
        change.current.action === "reject"
      ) {
        // update document status
        return client(`/admin/rider/${riderId}/document/${data.id}`, {
          method: "PATCH",
          data: {
            status:
              change.current.action === "approve" ? "approved" : "rejected",
            rejection_reason:
              change.current.action === "approve" ? null : rejectionReasons,
          },
        });
      } else if (change.current.action === "delete") {
        // delete document
        return client(`/admin/rider/${riderId}/document/${data.id}`, {
          method: "DELETE",
        });
      } else if (change.current.action === "upload") {
        // upload document

        const formdata = new FormData();
        formdata.append("media", data.doc);

        return client(
          `/admin/rider/${riderId}/document?document-name=${data.docName}`,
          {
            data: formdata,
            onUploadProgress: (progressEvent) => {
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              data.setProgress(percentCompleted);
            },
          }
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["riderDetail", { riderId }]);

        if (change.current.action === "approve") {
          closeApprovalModal();
        } else if (change.current.action === "reject") {
          closeRejectionModal();
        } else if (change.current.action === "upload") {
          closeModal();
        }
        change.current = {};
      },
      onMutate: (data) => {
        const previousItems = queryClient.getQueryData([
          "riderDetail",
          { riderId },
        ]);

        if (change.current.action === "approve") {
          queryClient.setQueryData(["riderDetail", { riderId }], (old) =>
            produce(old, (draft) => {
              draft.rider.document = draft.rider.document.map((doc) =>
                doc.name === data.id ? { ...doc, status: "approved" } : doc
              );
            })
          );
        } else if (change.current.action === "reject") {
          queryClient.setQueryData(["riderDetail", { riderId }], (old) =>
            produce(old, (draft) => {
              draft.rider.document = draft.rider.document.map((doc) =>
                doc.name === data.id ? { ...doc, status: "rejected" } : doc
              );
            })
          );
        } else if (change.current.action === "delete") {
          queryClient.setQueryData(["riderDetail", { riderId }], (old) =>
            produce(old, (draft) => {
              draft.rider.document = draft.rider.document.filter(
                (doc) => doc.name !== data.id
              );
            })
          );
        }

        return () =>
          queryClient.setQueryData(["riderDetail", { riderId }], previousItems);
      },
      onError: (error) => {
        queryClient.invalidateQueries(["riderDetail", { riderId }]);
      },
    }
  );

  const approveDocument = (id) => {
    change.current = {
      id,
      action: "approve",
    };
    revealApproveDocumentModal();
  };
  const rejectDocument = (id) => {
    change.current = {
      id,
      action: "reject",
    };
    revealRejectDocumentModal();
  };
  const deleteDocument = (id) => {
    change.current = {
      id,
      action: "delete",
    };
    revealDeleteDocumentModal();
  };

  const closeApprovalModal = () => {
    closeApproveDocumentModal();
    change.current = {};
  };
  const closeRejectionModal = () => {
    closeRejectDocumentModal();
    change.current = {};
  };
  const closeDeleteModal = () => {
    closeDeleteDocumentModal();
    change.current = {};
  };

  return (
    <>
      <CustomModal>
        <DocumentModal
          path={`/admin/rider/${riderId}/document`}
          queryId={["riderDetail", { riderId }]}
          close={closeModal}
        />
      </CustomModal>
      <ApproveDocumentModal>
        <ConfirmationModal
          header="Approve Document"
          message={
            selectedDocument.current?.rejection_reason.length > 0
              ? `This document was rejected because of ${selectedDocument.current?.rejection_reason?.reduce(
                  (acc, curr, index, arr) => {
                    if (index === arr.length - 1) {
                      return `${acc} and ${curr}`;
                    } else {
                      return `${acc}, ${curr}`;
                    }
                  }
                )}. Are you sure you want to activate it?`
              : "This is to certify that this document has been viewed and approved by you"
          }
          onConfirm={() => {
            mutate({ id: change.current.id });
          }}
          confirmText="Approve"
          closeModal={() => closeApprovalModal()}
          cancelText="Cancel"
          isLoading={isMutationLoading && change.current.action === "approve"}
          isError={isMutationError && change.current.action === "approve"}
          error={mutationError}
          isSuccess={isMutationSuccess && change.current.action === "approve"}
        />
      </ApproveDocumentModal>
      <RejectDocumentModal>
        <Card className="restaurantDeactivation__modal">
          <div className="restaurantDeactivation__modal-header">
            Disapprove Document
          </div>
          <p className="restaurantDeactivation__modal-description">
            Give a reason why the document is not approved
          </p>
          <SelectableTagList
            tags={documentRejectionReasons}
            selected={rejectionReasons}
            onClick={(tag) => {
              setRejectionReasons((reasons) =>
                produce(reasons, (draft) => {
                  if (draft.includes(tag)) {
                    draft.splice(draft.indexOf(tag), 1);
                  } else {
                    draft.push(tag);
                  }
                })
              );
            }}
            className="restaurantDeactivation__modal-tags"
          />

          <div className="restaurantDeactivation__modal-footer">
            <Button
              onClick={closeRejectionModal}
              title="Cancel"
              className={"cancel"}
              disabled={isMutationLoading && change.current.action === "reject"}
            />{" "}
            <Button
              className={"approve"}
              titleClass={"approve-text"}
              onClick={() => mutate({ id: change.current.id })}
              title={isMutationLoading ? <LoadingSpinner /> : "Reject"}
              disabled={rejectionReasons.length === 0 || isMutationLoading}
            />
          </div>
        </Card>
      </RejectDocumentModal>
      <DeleteDocumentModal>
        <ConfirmationModal
          header="Delete Document"
          message="Deleting this document will permanently remove it from our records. Do you wish to continue?"
          onConfirm={() => {
            mutate({ id: change.current.id });
          }}
          confirmText="Delete"
          closeModal={() => closeDeleteModal()}
          cancelText="Cancel"
          isLoading={isMutationLoading && change.current.action === "delete"}
          isError={isMutationError && change.current.action === "delete"}
          error={mutationError}
          isSuccess={isMutationSuccess && change.current.action === "delete"}
          alert
        />
      </DeleteDocumentModal>

      <Card className={"document"}>
        <h3>Documents</h3>
        <div className="bodytext">Upload, edit and delete documents.</div>
        {documents && documents?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="infotext">File</th>
                <th className="infotext"> Description</th>
                <th className="infotext">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <FolderIcon />
                    </td>
                    <td className="subtext">{data.name}</td>
                    <td className="action">
                      <a
                        href={data.link}
                        className="view infotext"
                        rel="noreferrer"
                        target="_blank"
                      >
                        View
                      </a>
                      <StatusPill value={data.status} textOnly />
                      <CustomDropdown
                        header={
                          <div className="dots">
                            <ThreeDot fill="#989b9b" />
                          </div>
                        }
                        align="left"
                        list={[
                          {
                            text: "Approve",
                            value: "approve",
                            className: "approve",
                            available: data.status !== "approved",
                          },
                          {
                            text: "Reject",
                            value: "reject",
                            className: "delete",
                            available: data.status !== "rejected",
                          },
                          {
                            text: "Delete",
                            value: "delete",
                            available: true,
                          },
                        ].filter((item) => {
                          if (data.status?.includes(item.value)) {
                            return false;
                          }
                          return true;
                        })}
                        onSelect={(value) => {
                          selectedDocument.current = data;
                          if (value.value === "approve") {
                            approveDocument(data.id);
                          } else if (value.value === "reject") {
                            rejectDocument(data.id);
                          } else if (value.value === "delete") {
                            deleteDocument(data.id);
                          }
                        }}
                        small
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <FallbackResultCard style={{ margin: "2rem 0" }}>
            <FolderIcon />
            <p>No Document found</p>
          </FallbackResultCard>
        )}
        <div className="document__add">
          <Button
            titleClass={"subtext"}
            title={"Add documents"}
            iconLeft={<PlusIcon />}
            onClick={revealModal}
          />
        </div>
      </Card>
    </>
  );
};

export default RiderDocument;
