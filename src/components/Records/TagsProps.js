import React from "react";

const TagsProps = ({ tags }) => {
  return (
    <div className="text-center">
      <div className="tag-props">
        {tags.map((tag, i) => (
          <React.Fragment key={i}>
            <span className="text-nowrap gray">{tag.label}</span>{" "}
            <span className="text-nowrap">{tag.value}</span>
            {tags[i+1] ? <span className="divider">|</span> : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


export default TagsProps;
