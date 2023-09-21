import { CircleCheck, LoadingSpinner } from "assets/icons";
import { Button, Checkbox, ErrorButton, RadioGroup } from "components";
import React, { useState } from "react";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useClient } from "utils/apiClient";

export default function SendSettings() {
  const [sendAs, setSendAs] = useState();
  const [sendTo, setSendTo] = useState([]);
  const [body, setBody] = useState();
  const [title, setTitle] = useState("");
  const client = useClient();

  const { mutate, isLoading, isError, isSuccess, error, reset } = useMutation(
    (data) => {
      // send email/notification

      return client(`/admin/settings/send`, {
        method: "POST",
        data,
      });
    },
    {
      onSuccess: () => {
        setBody();
        setTitle("");
        setSendAs();
        setSendTo([]);

        setTimeout(() => {
          reset();
        }, 3000);
      },
    }
  );

  const sendNotification = () => {
    // console.log("send notification", {
    //   sendAs,
    //   sendTo,
    //   body,
    //   title,
    // });
    mutate({
      send_as: sendAs,
      send_to: sendTo,
      body,
      title,
    });
  };

  return (
    <div className="card sendSettings">
      <h3 className="sendSettings__header">Send Email and Notifications</h3>
      <RadioGroup
        label="Send notification messages as"
        name="notification type selector"
        options={[
          { name: "Push Notification", value: "push" },
          { name: "Email Notification", value: "email" },
        ]}
        value={sendAs}
        onChange={(value) => setSendAs(value)}
      />
      <div className="send">
        <span>Send to</span>
        <div className="send-options">
          <Checkbox
            label="All"
            isChecked={sendTo.length === 3}
            setIsChecked={(value) =>
              value
                ? setSendTo(["consumers", "restaurants", "riders"])
                : setSendTo([])
            }
          />
          <Checkbox
            label="Consumers"
            isChecked={sendTo?.includes("consumers")}
            setIsChecked={(value) =>
              value
                ? setSendTo((initial) => [...initial, "consumers"])
                : setSendTo((initial) =>
                    initial.filter((i) => i !== "consumers")
                  )
            }
          />
          <Checkbox
            label="Restaurants"
            isChecked={sendTo?.includes("restaurants")}
            setIsChecked={(value) =>
              value
                ? setSendTo((initial) => [...initial, "restaurants"])
                : setSendTo((initial) =>
                    initial.filter((i) => i !== "restaurants")
                  )
            }
          />
          <Checkbox
            label="Riders"
            isChecked={sendTo?.includes("riders")}
            setIsChecked={(value) =>
              value
                ? setSendTo((initial) => [...initial, "riders"])
                : setSendTo((initial) => initial.filter((i) => i !== "riders"))
            }
          />
        </div>
      </div>
      {isError && (
        <p className="errorMessage">
          <ErrorButton /> {error.message}
        </p>
      )}
      {isSuccess && (
        <p className="sucessMessage">
          <CircleCheck /> Notification sent successfully
        </p>
      )}
      <div className="editor">
        <div className="editor-header">
          <span className="editor-header-title">Send Message</span>
          <Button
            title="Send"
            className="editor-header-send"
            disabled={!(sendAs && sendTo && body && title)}
            onClick={sendNotification}
            iconLeft={isLoading ? <LoadingSpinner /> : null}
          />
        </div>
        <div className="editor-title">
          <input
            className="editor-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subject"
          />
        </div>
        <ReactQuill theme="snow" value={body} onChange={setBody} />
      </div>
    </div>
  );
}
