import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The file path that we want to process',
    required: true
  })
  @AutoMap()
  @IsString()
  readonly filePath: string;

  @ApiProperty({
    description: 'The number of the page that we want to process',
    default: 1
  })
  @AutoMap()
  @IsNumber()
  readonly pageNumber?: number = 1;

  @ApiProperty({
    description: 'The container name that the file is stored'
  })
  @AutoMap()
  @IsString()
  readonly containerName: string;

  @ApiProperty({
    description: 'The path where the process result will be stored'
  })
  @AutoMap()
  @IsString()
  readonly resultPath?: string;

  @ApiProperty({
    description: 'The language of the file',
    default: 'fr-FR'
  })
  @AutoMap()
  @IsString()
  readonly language?: string = 'fr-FR';
}
