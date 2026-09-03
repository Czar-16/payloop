import { signIn } from "@/lib/auth";
export default function TestAuth() {
  return (
    <form
      action={async (formData) => {
        "use server";

        await signIn("credentials", {
          identifier: formData.get("identifier"),
          password: formData.get("password"),
          redirectTo: "/",
        });
      }}
    >
      <input name="identifier" placeholder="Email or phone" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Sign in</button>
    </form>
  );
}
