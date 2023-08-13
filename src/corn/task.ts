import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ListService } from 'src/list/list.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/common/mail.service';
import * as moment from 'moment';

const emailContent = `
<h1>任务提醒</h1>
<p>尊敬的用户，您设置的任务已经到了预定的时间：</p>
<p><strong>任务名称：</strong> {taskName}</p>
<p><strong>任务时间：</strong> {taskTime}</p>
<p><strong>任务描述：</strong> {description}</p>
<p>请及时完成您的任务。</p>
<p>感谢您使用我们的服务！</p>
`;

@Injectable()
export class TaskCronService {
  constructor(
    private readonly listService: ListService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Cron('0 * * * * *')
  async handleCron() {
    console.log('执行了任务');
    return;
    const currentTime = new Date().getTime();
    const maxDiff = 59; //秒
    const tasks = await this.listService.findAllNormalTask();
    const filteredTasks = tasks.filter((task) => {
      const taskTime = task.taskTime;
      const timeDifference = Math.abs(taskTime.getTime() - currentTime) / 1000; // 转换为秒
      return timeDifference <= maxDiff;
    });

    //目前需要支持四种提醒方式
    //1. 邮箱
    //2. app通知
    //3. 微信通知
    //4. 短信通知
    //为了性能，最好发送都是调用其他服务
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i];
      const user = await this.userService.findUserById(task.userId);
      if (user !== null) {
        if (!!user.email) {
          this.mailService.sendEmail(
            user.email,
            task.title,
            emailContent
              .replace('{taskName}', task.title)
              .replace(
                '{taskTime}',
                moment(task.taskTime).format('YYYY-MM-DD HH:mm'),
              )
              .replace('description', task.description),
          );
        }

        if (!!user.phone && !!user.phoneCode) {
          //todo..
        }

        //其他的需要做到了再写
      }
    }
  }
}
