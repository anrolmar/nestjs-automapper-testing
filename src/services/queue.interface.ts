import { Queue } from '@models/queue.model';

export interface QueueService {
  createMessage(name: string, data: Queue): void;
}
