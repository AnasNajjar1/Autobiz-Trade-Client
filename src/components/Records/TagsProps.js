import React from "react";
import { t } from "../common/Translate";

const TagsProps = ({ tags }) => {
  return (
    <div className="text-center">
      <div className="tag-props">
        {tags
          .filter(function(tag) {
            if (tag.value === null) {
              return false;
            }
            return true;
          })
          .map((tag, i) => (
            <span className="tag-prop" key={i}>
              <span className="text-nowrap gray">{t(tag.label)}</span>{" "}
              <span className="text-nowrap">{t(tag.value)}</span>
            </span>
          ))}
      </div>
    </div>
  );

  /*   return (
    <div className="text-center">
      <div className="tag-props">
        {tags.map((tag, i) => (
          <React.Fragment key={i}>
            <span className="text-nowrap gray">{t(tag.label)}</span>{" "}
            <span className="text-nowrap">{t(tag.value)}</span>
            {tags[i + 1] ? <span className="divider">|</span> : ""}
          </React.Fragment>
        ))}
      </div>
    </div>
  ); */
};

export default TagsProps;
