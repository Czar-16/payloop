import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Add Money</h2>

          <TextInput
            label="Amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
          />

          <Select
            label="Bank"
            name="bank"
            options={[
              { value: "hdfc", label: "HDFC Bank" },
              { value: "sbi", label: "State Bank of India" },
              { value: "icici", label: "ICICI Bank" },
            ]}
          />

          <Button type="submit">Add Money</Button>
        </div>
      </Card>
    </main>
  );
}
