import { Appbar } from "@repo/ui/appbar";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";

export default function Home() {
  return (
    <>
      <Appbar user={{ name: "Czar16" }} />

      <Center>
        <Card>
          <h2 className="text-xl font-semibold">Welcome to Payloop</h2>
        </Card>
      </Center>
    </>
  );
}
