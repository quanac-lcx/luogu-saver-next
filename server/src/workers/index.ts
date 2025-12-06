import { config } from "@/config";
import { Queue } from '@/utils/queue';
import type { UserTask } from '@/types/user-task';
import * as processorWorker from './processor.worker';

let requestToken = config.queue.maxRequestToken;
const taskQueue: Queue<UserTask> = new Queue<UserTask>();

function scheduleTokenRegeneration() {
    setInterval(
        () => {
            requestToken = Math.min(
                requestToken + config.queue.regenerationSpeed,
                config.queue.maxRequestToken
            );
        },
        config.queue.regenerationInterval
    )
}

function sendTaskToProcessor() {
    if (taskQueue.count() && requestToken > 0 && !taskQueue.isRunningFull()) {
        requestToken -= 1;
        const task = taskQueue.popTask();
        queue.incRunning();
        processorWorker.executeTask(task).finally(() => taskQueue.decRunning());
    }
}

export function initializeWorkers() {
    scheduleTokenRegeneration();
    setInterval(sendTaskToProcessor, config.queue.processInterval);
}