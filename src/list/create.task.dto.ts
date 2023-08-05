import { Column } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsDate,
  IsOptional,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class TaskDto {
  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  title: string;

  @Column()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  curDay: Date;

  @Column()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  taskTime: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  description: string;
}
