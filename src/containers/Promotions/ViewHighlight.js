import React from "react";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";
// import {
//   highlight1,
//   highlight2,
//   highlight3,
//   highlight4,
// } from "assets/images";
import { Card, FallbackResultCard, FullPageSpinner, Image } from "components";
import { Pleased } from "assets/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import HighlightBuilder from "./HighlightBuilder";

const ViewHighlight = () => {
  const client = useClient();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const selectedTemplateId = searchParams.get("template");

  const { data, isLoading, isIdle, isError, error } = useQuery(
    ["highlightTemplates"],
    () => {
      // if (selectedTemplateId) return;
      return client("admin/promotions/highlights/templates");

      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve({
      //       templates: [
      //         { id: 1, image: highlight1 },
      //         {
      //           id: 2,
      //           image: highlight2,
      //         },
      //         {
      //           id: 3,
      //           image: highlight3,
      //         },
      //         {
      //           id: 4,
      //           image: highlight4,
      //         },
      //       ],
      //     });
      //   }, 1000);
      // });
    }
  );

  if (isError) throw error;

  if (selectedTemplateId) {
    return <HighlightBuilder />;
  }

  return (
    <div className="viewHighlights">
      <h2 className="viewHighlights__title">Express Yourself</h2>
      <p className="viewHighlights__description">
        Pick a template, express yourself, tell your users more about you
      </p>

      {isIdle || isLoading ? (
        <Card style={{ margin: "2rem 0" }}>
          <FullPageSpinner containerHeight="20rem" />
        </Card>
      ) : (
        <>
          {data?.length ? (
            <>
              <h3 className="viewHighlights__action">
                Select a template to customize
              </h3>
              <div className="viewHighlights__templates">
                {data.map((template, index) => (
                  <div
                    key={template.id}
                    className="viewHighlights__templates-item"
                  >
                    <h3 className="viewHighlights__templates-item-title">
                      Template {index + 1}
                    </h3>
                    <Image
                      src={template.image}
                      alt={`template${template.id}`}
                      className="viewHighlights__templates-item-image"
                    >
                      <div className="overlay">
                        <button
                          onClick={() =>
                            navigate({
                              pathname: "/promotions/highlight/create",
                              search: `?template=${template.id}`,
                            })
                          }
                        >
                          Customize
                        </button>
                      </div>
                    </Image>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <FallbackResultCard className="viewHighlights__fallback">
              <Pleased />
              <p>No Highlight Template found</p>
            </FallbackResultCard>
          )}
        </>
      )}
    </div>
  );
};

export default ViewHighlight;
