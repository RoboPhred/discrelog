import { SaveData } from "@/services/savedata/types";

export interface Example {
  title: string;
  getSave: () => Promise<SaveData>;
}
