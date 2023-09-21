import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function HighlightBuilder() {
  let [searchParams] = useSearchParams();
  const selectedTemplateId = searchParams.get("template");

  return (
    <div className="highlightBuilder">
      <Link to="/promotions/highlight/create">Back</Link>
      <h2 className="highlightBuilder__title">Template {selectedTemplateId}</h2>
    </div>
  );
}
