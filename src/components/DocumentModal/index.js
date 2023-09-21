import apiAxios from "apis/apiAxios";
import {
  CircleCheck,
  DeleteIcon,
  FileUploadIcon,
  UploadIcon,
} from "assets/icons";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import ErrorButton from "components/ErrorButton";
import ModalInput from "components/FormElements/ModalInput";
import ProgressBar from "components/ProgressBar";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
// import { useClient } from "utils/apiClient";
import { capitalizeFirstLetter } from "utils/capitalize";
import formatBytes from "utils/formatBytes";

const controller = new AbortController();

export default function DocumentModal({
  path,
  queryId,
  close,
  onUploadSuccess,
}) {
  const fileRef = useRef();
  const [newDocumentName, setNewDocumentName] = useState("");
  const [progress, setProgress] = useState(0);

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  const [newDocument, setNewDocument] = useState();

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewDocument(e.dataTransfer.files[0]);
    }
  };

  // const client = useClient();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess, error, reset } = useMutation(
    (data) => {
      // upload document

      const formdata = new FormData();
      formdata.append("media", data.doc);

      // return client(
      //   `${path}?document-name=${data.docName}`,
      //   {
      //     data: formdata,
      //     onUploadProgress: (progressEvent) => {
      //       let percentCompleted = Math.round(
      //         (progressEvent.loaded * 100) / progressEvent.total
      //       );
      //       // console.log("percentCompleted", percentCompleted, "%");
      //       data.setProgress(percentCompleted);
      //     },
      //     signal: controller.signal,
      //   }
      // );

      return apiAxios.post(`${path}?document-name=${data.docName}`, formdata, {
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // console.log("percentCompleted", percentCompleted, "%");
          data.setProgress(percentCompleted);
        },
        signal: controller.signal,
      });
    },
    {
      onSuccess: (data, variables) => {
        setTimeout(() => close(), 500);
        onUploadSuccess && onUploadSuccess(data, variables);
        queryClient.invalidateQueries(queryId);
      },
      onError: () => {
        setNewDocument();
      },
    }
  );

  const cancelUpload = () => {
    reset();
    if (isLoading) {
      controller.abort();
    } else {
      setNewDocument();
    }
  };

  function onChangeTitle(e) {
    setNewDocumentName(e.target.value);
  }

  const newDocumentNameRef = useRef();
  const deleteNewDocument = () => {};

  const submit = (doc, docName, setProgress) => {
    mutate({ doc, docName, setProgress });
  };

  return (
    <Card className="document__modal">
      <div className="document__modal-header">Add Document</div>

      <ModalInput
        style={{ width: "100%" }}
        labelClassName="document__modal-label"
        className="document__modal-name"
        label={"Name"}
        value={newDocumentName}
        onChange={onChangeTitle}
        placeholder={"Enter document name"}
        ref={newDocumentNameRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newDocumentName && newDocument) {
            submit(newDocument, newDocumentName, setProgress);
          }
        }}
      />
      {newDocument ? (
        <div className="document__modal-progress">
          <FileUploadIcon />
          <div className="document__modal-progress-text">
            {newDocumentName ? (
              <>
                <p className="name">
                  {capitalizeFirstLetter(newDocumentName)}.pdf
                </p>
                <p className="size">{formatBytes(newDocument.size)}</p>
              </>
            ) : (
              <>
                <p
                  className="enterName"
                  onClick={() => newDocumentNameRef.current.focus()}
                >
                  Enter Document Name
                </p>
                <p className="initial">
                  File: {newDocument.name}, Size:{" "}
                  {formatBytes(newDocument.size)}
                </p>
              </>
            )}
            {isLoading || isSuccess ? (
              <div className="progress">
                <ProgressBar progress={progress} />
                {isSuccess ? <CircleCheck /> : <span>{progress}%</span>}
              </div>
            ) : (
              <button
                className="upload"
                disabled={!newDocumentName}
                onClick={() =>
                  submit(newDocument, newDocumentName, setProgress)
                }
              >
                Upload Document
              </button>
            )}
          </div>
          <div
            className="document__modal-progress-delete"
            onClick={cancelUpload}
          >
            <DeleteIcon onClick={deleteNewDocument} />
          </div>
        </div>
      ) : (
        <div
          className={`document__modal-upload ${dragActive ? "dragActive" : ""}`}
          onClick={() => fileRef.current.click()}
          tabIndex={0}
          onDragEnter={handleDrag}
        >
          {dragActive && (
            <div
              className="document__modal-upload-drag"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
          {isError && (
            <p className="error">
              <ErrorButton />
              {error.message}. Try again
            </p>
          )}
          <div className="document__modal-upload-icon">
            <UploadIcon />
          </div>
          {dragActive ? (
            <div className="document__modal-upload-drop">
              Drop File to Upload
            </div>
          ) : (
            <div className="document__modal-upload-text">
              <div>
                <Button
                  className={"click"}
                  titleClass="green"
                  title={"Click to upload"}
                />
                <input
                  ref={fileRef}
                  onChange={(e) => {
                    reset();
                    setNewDocument(e.target.files[0]);
                    newDocumentName &&
                      submit(e.target.files[0], newDocumentName, setProgress);
                  }}
                  multiple={false}
                  type="file"
                  hidden
                />
                <span className="textsm">or drag and drop</span>
              </div>
              <p>Pdf, .excel (max. 10MB)</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
