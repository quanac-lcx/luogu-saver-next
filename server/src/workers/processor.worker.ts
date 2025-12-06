import { TaskType, TaskStatus } from "@/constants/task";
import type { UserTask } from '@/types/user-task';
import { logger } from "@/utils/logger";
import { TaskService } from "@/services/task.service";

export async function executeTask(task) {
    logger.info({ task }, 'Processing task in worker.');
    await TaskService.updateTask(task.id, TaskStatus.PROCESSING);
}