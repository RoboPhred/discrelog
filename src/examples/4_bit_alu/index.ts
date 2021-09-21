import { Example } from "@/services/examples/types";
import { SaveData } from "@/services/savedata/types";

const fourBitAlu: Example = {
  title: "4-Bit ALU",
  getSave: () => import("./save.json") as Promise<SaveData>,
};

export default fourBitAlu;
