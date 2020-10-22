import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';

import { CreateMessageDto } from '@dtos/create-message.dto';
import { Queue } from '@models/queue.model';

@Profile()
export class QueueProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(CreateMessageDto, Queue).reverseMap();
  }
}
