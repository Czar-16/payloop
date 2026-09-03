import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Add Money</h2>
        <p className="mb-4 text-gray-600">Add money to your Payloop wallet.</p>

        <Button>Add Money</Button>
      </Card>
    </main>
  );
}
