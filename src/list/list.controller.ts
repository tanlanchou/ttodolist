import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ListService } from './list.service';
import { List } from '../connect/list.entity';
import { JwtAuthGuard } from '../guard/jwt.auth.guard';
import { JwtCommonService } from 'src/auth/jwt.common.service';
import { JwtInterceptor } from 'src/interceptors/jwt.interceptor';
import { TaskDto } from './create.task.dto';

@Controller('lists')
@UseGuards(JwtAuthGuard)
@UseInterceptors(JwtInterceptor)
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly jwtCommonService: JwtCommonService,
  ) {}

  @Get('/all/:page')
  async findAll(@Param('page') page: number, @Req() request): Promise<List[]> {
    const userId = request.user.id;
    return this.listService.findAll(userId, {
      page,
      pageSize: 25,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request): Promise<List> {
    const result = await this.listService.findOne(id);
    if (result === null) throw new HttpException('404', HttpStatus.NOT_FOUND);

    if (result.userId !== request.user.id) {
      throw new HttpException('Forbidden', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Post('create')
  async create(@Body() task: TaskDto, @Req() request): Promise<List> {
    const list = new List();
    list.title = task.title;
    list.curDay = task.curDay;
    list.description = task.description;
    list.taskTime = task.taskTime;
    list.userId = request.user.id;

    return await this.listService.create(list);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() list: TaskDto,
    @Req() request,
  ): Promise<void> {
    const task = await this.listService.findOne(id);
    if (task === null) throw new HttpException('404', HttpStatus.NOT_FOUND);

    if (task.userId !== request.user.id)
      throw new HttpException('Forbidden', HttpStatus.NOT_FOUND);

    const entity = new List();
    for (const key in list) {
      entity[key] = list[key];
    }
    await this.listService.update(id, entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.listService.remove(id);
  }
}
