import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Login</h2>

          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
          />

          <Button type="submit">Login</Button>
        </div>
      </Card>
    </main>
  );
}
