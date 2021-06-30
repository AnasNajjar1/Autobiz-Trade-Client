import React, { useEffect } from "react";
import { ZendeskAPI } from "react-zendesk";

export const ZendeskDisplayer = ({ language }) => {
  useEffect(() => {
    if (!window.zE) return;
    language !== "es"
      ? ZendeskAPI("webWidget", "hide")
      : ZendeskAPI("webWidget", "show");
  }, [window.zE, language]);

  return null;
};
