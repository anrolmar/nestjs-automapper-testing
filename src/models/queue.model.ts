import { AutoMap } from 'nestjsx-automapper';

export class Queue {
  @AutoMap()
  filePath: string;

  @AutoMap()
  pageNumber: number;

  @AutoMap()
  containerName: string;

  @AutoMap()
  resultPath: string;

  @AutoMap()
  language: string;
}
