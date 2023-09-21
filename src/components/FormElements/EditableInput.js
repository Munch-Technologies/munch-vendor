import { EditIcon, LoadingSpinner } from "assets/icons";
import ErrorButton from "components/ErrorButton";
import debounceFn from "debounce-fn";
import React, { forwardRef, useLayoutEffect, useRef, useState } from "react";

const EditableInput = forwardRef(
  (
    {
      content,
      className,
      wrapperClassName,
      isLoading,
      isError,
      error,
      onChange,
      placeholder,
      maxWidth = 400,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef();
    const pushChange = debounceFn((e) => onChange(e.target.value), {
      wait: 300,
    });

    const [value, setValue] = useState(content || placeholder);

    const dummyTextRef = useRef();

    const processChange = (e) => {
      setValue(e.target.value);
      pushChange(e);
      // debounceFn(() => onChange(e.target.value), { wait: 300 });
    };

    useLayoutEffect(() => {
      let width = dummyTextRef.current.offsetWidth + 20;
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      if (width < maxWidth) {
        inputRef.current.style.width = `${width}px`;
      }
    }, [maxWidth, value]);

    return (
      <>
        <div className={`editableInput ${wrapperClassName}`}>
          <textarea
            className={`editableInput-input ${className}`}
            defaultValue={content}
            cols="30"
            rows="1"
            onChange={processChange}
            ref={(textareaRef) => {
              inputRef.current = textareaRef;
              if (ref) ref.current = textareaRef;
            }}
            spellCheck="false"
            placeholder={placeholder}
            {...props}
          ></textarea>
          <div
            className="editableInput-editButton"
            onClick={() => inputRef.current.focus()}
          >
            <EditIcon />
          </div>
          <div className="editableInput-status">
            {isError && (
              <>
                <ErrorButton className="editableInput-status-errorButton" />{" "}
                <p className="editableInput-status-error">
                  {error?.message ?? "Error saving changes"}
                </p>
              </>
            )}
            {isLoading && (
              <>
                <LoadingSpinner width="18px" />{" "}
                <p className="editableInput-status-saving">saving changes</p>
              </>
            )}
          </div>
        </div>
        <span
          className={`editableInput-input ${className} dummy`}
          ref={dummyTextRef}
        >
          {value || placeholder}
        </span>
      </>
    );
  }
);

export default EditableInput;
