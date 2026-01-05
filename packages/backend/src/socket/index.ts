import { Socket } from 'socket.io';
import { handleTaskRoomJoin } from './handlers/task.handler';
import { logger } from '@/lib/logger';

export async function socketJoinHandler(socket: Socket, room: string) {
    const [type, id] = room.split(':');

    if (!type || !id) return;

    switch (type) {
        case 'task':
            await handleTaskRoomJoin(socket, id);
            break;
        default:
            logger.debug({ room }, 'No specialized handler for this room type');
    }
}
