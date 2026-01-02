import { apiFetch } from '@/utils/request.ts';
import type { ApiResponse } from '@/types/common';
import type { TaskInfo, CommonTask } from '@/types/task';

export async function getTaskById(id: string) {
    return (await apiFetch(`/task/query/${id}`)) as ApiResponse<TaskInfo>;
}

export async function createTask(task: CommonTask) {
    return (await apiFetch('/task/create', {
        method: 'POST',
        data: { type: task.type, payload: task.payload }
    })) as ApiResponse<{ taskId: string }>;
}
