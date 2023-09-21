import { EditIcon, LoadingSpinner } from "assets/icons";
import ErrorButton from "components/ErrorButton";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import ModalInput from "./ModalInput";
import TextArea from "./TextArea";

const EditableInput2 = forwardRef(
  (
    {
      className,
      save,
      placeholder,
      children: content,
      isLoading,
      isError,
      isSuccess,
      error,
      textarea,
      autoClose,
    },
    ref
  ) => {
    const [showEdit, setShowEdit] = useState(false);
    const [editValue, setEditValue] = useState(content);

    const inputRef = useRef();

    const runSave = () => {
      save(editValue);
      if (autoClose) setShowEdit(false);
    };

    useEffect(() => {
      if (showEdit) {
        inputRef.current?.focus();
      }
    }, [showEdit]);

    useEffect(() => {
      setEditValue(content);
    }, [content]);

    useEffect(() => {
      if (isSuccess) {
        setShowEdit(false);
      }
    }, [isSuccess]);

    return (
      <div className={`editableInput2 ${className}`}>
        <div
          className={`editableInput2__content ${className}`}
          onClick={() => {
            setShowEdit(true);
          }}
          style={{ marginRight: 0 }}
          ref={ref}
        >
          {content || placeholder}
        </div>
        <EditIcon
          onClick={() => setShowEdit(true)}
          className="editableInput2__editIcon"
        />
        {showEdit && (
          <div className="editableInput2__edit">
            {isError && (
              <p className="editableInput2__edit-error">
                <ErrorButton /> {error.message}
              </p>
            )}
            {textarea ? (
              <TextArea
                className={`editableInput2__edit-input ${error && "error"}`}
                placeholder={placeholder}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={isLoading}
                ref={inputRef}
                onKeyDown={(e) => e.key === "Enter" && runSave()}
              />
            ) : (
              <ModalInput
                className={`editableInput2__edit-input ${error && "error"}`}
                placeholder={placeholder}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={isLoading}
                ref={inputRef}
                onKeyDown={(e) => e.key === "Enter" && runSave()}
              />
            )}
            <div className="editableInput2__edit-actions">
              <button
                className="close"
                disabled={isLoading}
                onClick={() => setShowEdit(false)}
              >
                Close
              </button>
              <button className="save" disabled={isLoading} onClick={runSave}>
                {isLoading ? <LoadingSpinner /> : isError ? "Retry" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default EditableInput2;
