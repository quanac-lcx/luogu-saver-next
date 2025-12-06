import { config } from '@/config';

export class Queue<T extends { id: string }> {

    queue: T[] = [];
    running = 0;

    isFull() { return queue.length >= config.queue.maxQueueLength; }
    isRunningFull() { return running >= config.queue.concurrencyLimit; }
    pushTask(task: T) { queue.push(task); }
    popTask(): T { return queue.shift(); }
    incRunning() { running++; }
    decRunning() { running--; }
    count(): number { return queue.length; }
    all(): T[] { return queue; }

    /*
     * Get the position of a task in the queue (1-based index). Returns `-1` if not found.
     * @param taskId - The ID of the task to find.
     * @return The position of the task in the queue, or `-1` if not found.
     */
    position(taskId: string): number {
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].id === taskId) {
                return i + 1;
            }
        }
        return -1;
    }
}