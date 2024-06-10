import { trpc } from "@trpc";
import { useState } from "react";

export default function Login() {
  const { auth } = trpc;
  const loginMutation = auth.login.useMutation();
  const refreshMutation = auth.refresh.useMutation();
  const logoutMutation = auth.logout.useMutation();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");

  return (
    <div>
      <h3>--Login--</h3>
      <label>Email:</label>
      <input value={email} onInput={(event) => setEmail(event.currentTarget.value)} />
      <label>Password:</label>
      <input value={password} onInput={(event) => setPassword(event.currentTarget.value)} />
      <button
        disabled={loginMutation.isLoading}
        onClick={() =>
          loginMutation.mutate({
            email: email,
            password: password,
          })
        }
      >
        Login
      </button>
      <button onClick={() => refreshMutation.mutate()}>Refresh</button>
      <button onClick={() => logoutMutation.mutate()}>Logout</button>
    </div>
  );
}
