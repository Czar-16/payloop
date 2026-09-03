import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";

export default function AddMoneyPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Add Money</h2>

      <Card>
        <div className="flex max-w-md flex-col gap-4">
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
    </div>
  );
}
