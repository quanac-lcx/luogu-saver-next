import { TaskType } from "@/constants/task";

export enum C3VKMode {
    LEGACY,
    MODERN,
    NONE
}

export const c3vkModes: Record<TaskType, C3VKMode> = {
    [TaskType.ARTICLE]: C3VKMode.MODERN,
    [TaskType.PASTE]: C3VKMode.LEGACY,
    [TaskType.BENBEN]: C3VKMode.NONE,
    [TaskType.JUDGEMENT]: C3VKMode.LEGACY,
    [TaskType.PROFILE]: C3VKMode.MODERN
};