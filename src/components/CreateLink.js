import React from "react";
import gql from "graphql-tag";
import { useMutation } from "urql";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const CreateLink = (props) => {
  const [description, setDescription] = React.useState("");
  const [url, setUrl] = React.useState("");

  const [state, executeMutation] = useMutation(POST_MUTATION);

  const submit = React.useCallback(() => {
    executeMutation({ url, description }).then(() => {
      props.history.push("/");
    });
  }, [executeMutation, url, description, props.history]);

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button disabled={state.fetching} onClick={submit}>
        Submit
      </button>
    </div>
  );
};

export default CreateLink;
