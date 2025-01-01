import { TaskParamType } from "@/lib/types";

export const colorForHandle = {
  [TaskParamType.STRING]: "!bg-amber-400",
  [TaskParamType.NUMBER]: "!bg-green-400",
  [TaskParamType.SELECT]: "!bg-rose-400",
  [TaskParamType.CREDENTIAL]: "!bg-teal-400",
  [TaskParamType.BROWSER_INSTANCE]: "!bg-sky-400",
};
