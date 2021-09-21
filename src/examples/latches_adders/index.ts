import { Example } from "@/services/examples/types";
import { SaveData } from "@/services/savedata/types";

const latchesAndAdders: Example = {
  title: "Latches and Adders",
  getSave: () => import("./save.json") as Promise<SaveData>,
};

export default latchesAndAdders;
