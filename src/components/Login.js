import React from "react";
import gql from "graphql-tag";
import { useMutation } from "urql";
import { setToken } from "../token";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
const Login = (props) => {
  // Used to switch between login and signup
  const [isLogin, setIsLogin] = React.useState(true);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const [state, executeMutation] = useMutation(
    isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION
  );

  const mutate = React.useCallback(() => {
    executeMutation({ email, password, name }).then(({ data }) => {
      const token = data && data[isLogin ? "login" : "signup"].token;
      if (token) {
        setToken(token);
        props.history.push("/");
      }
    });
  }, [executeMutation, props.history, isLogin, email, password, name]);

  return (
    <div>
      <h4 className="mv3">{isLogin ? "Login" : "Sign Up"}</h4>

      <div className="flex flex-column">
        {!isLogin && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>

      <div className="flex mt3">
        <button
          type="button"
          className="pointer mr2 button"
          disabled={state.fetching}
          onClick={mutate}
        >
          {isLogin ? "login" : "create account"}
        </button>
        <button
          type="button"
          className="pointer button"
          disabled={state.fetching}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "need to create an account?" : "already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default Login;
