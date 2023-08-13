import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../connect/list.entity';
import { Flag, Status } from 'src/common/enmu';
import { IPage } from 'src/interface/page';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  findAll(userId: number, options: IPage): Promise<List[]> {
    return this.listRepository.find({
      where: {
        userId,
      },
      order: {
        createTime: 'DESC', // 按 createTime 降序排序
      },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
    });
  }

  findAllNormalTask(): Promise<List[]> {
    return this.listRepository.find({
      where: {
        flag: Flag.NotExpired,
        status: Status.Normal,
      },
    });
  }

  findOne(id: number): Promise<List> {
    return this.listRepository.findOne({ where: { id } });
  }

  create(task: List): Promise<List> {
    task.createTime = new Date();
    task.flag = Flag.NotExpired;
    task.status = Status.Normal;

    return this.listRepository.save(task);
  }

  async update(id: number, list: List): Promise<void> {
    await this.listRepository.update(id, list);
  }

  async remove(id: number, userId = 0): Promise<void> {
    if (userId == 0) {
      await this.listRepository.delete(id);
    } else {
      await this.listRepository.delete({
        id,
        userId,
      });
    }
  }
}
