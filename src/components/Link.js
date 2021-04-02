import React from "react";

const Link = ({ link }) => (
  <div>
    <div>
      {link.description} ({link.url})
    </div>
  </div>
);

export default Link;
