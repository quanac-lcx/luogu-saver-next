import { Task } from '@/entities/task';
import { TaskStatus } from '@/constants/task';
import { logger } from '@/utils/logger';
import { getRandomString } from "@/utils/string";

export class TaskService {
    static async updateTask(taskId: string, status: TaskStatus, info?: string) {
        const task = await Task.findOne({where: {id: taskId}});
        if (!task) {
            logger.error({taskId}, 'Task not found for update.');
            return;
        }

        task.status = status;
        if (info) {
            task.info = info;
        }
        await task.save();
        logger.info({taskId, status}, 'Task updated successfully.');
    }

    static async createTask(task: Partial<Task>) {
        const newTask = Task.create(task);
        newTask.id = getRandomString(8);
        await newTask.save();
        logger.info({taskId: newTask.id}, 'Task created successfully.');
        return newTask;
    }
}