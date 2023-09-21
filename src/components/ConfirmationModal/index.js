import { LoadingSpinner } from "assets/icons";
import Button from "components/Button/Button";
import ErrorButton from "components/ErrorButton";
import React, { useEffect } from "react";

export default function ConfirmationModal({
  header,
  message,
  onConfirm,
  confirmText,
  closeModal,
  cancelText,
  alert,
  instantClose,
  isLoading,
  isError,
  isSuccess,
  error,
}) {
  const confirm = () => {
    onConfirm();
    instantClose && closeModal();
  };

  useEffect(() => {
    if (isSuccess && !instantClose) {
      closeModal();
    }
  }, [closeModal, instantClose, isSuccess]);

  return (
    <div className="confirmationModal">
      <h3 className={`confirmationModal__header ${alert && "alert"}`}>
        {header || "Modal Header"}
      </h3>
      <p className="confirmationModal__message">{message || "Modal Message"}</p>
      {isError && (
        <div className="confirmationModal__error">
          <ErrorButton /> {error.message}
        </div>
      )}
      <div className="confirmationModal__buttons">
        <Button
          title={cancelText || "Cancel"}
          onClick={closeModal}
          className="confirmationModal__buttons-cancel"
          disabled={isLoading}
        />
        <Button
          title={confirmText || "Yes"}
          iconLeft={isLoading ? <LoadingSpinner /> : null}
          className={`confirmationModal__buttons-confirm ${alert && "alert"}`}
          onClick={confirm}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
