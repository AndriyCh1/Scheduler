import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskDto } from 'src/dto/tasks.dto';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
    constructor(private schedulerService: SchedulerService) {}

    @Post()
    create(@Body() task: TaskDto): Promise<TaskDto>{
        return this.schedulerService.createTask(task);
    }


    @Get()
    findAll(): Promise<TaskDto[]>{
        return this.schedulerService.findAllTasks();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<TaskDto>{
        return this.schedulerService.findTaskById(id);
    }


    @Get("/date/:dt")
    findAllByDate(@Param("dt") date: string): Promise<TaskDto[]>{
        return this.schedulerService.findAllTasksByDate(date);
    }

    @Put("/:id") 
    update(
        @Param("id") id: number,
        @Body() task: TaskDto,
    ){
        return this.schedulerService.updateTask(id, task);
    }


    @Delete("/:id")
    delete(@Param("id") id: number){
        return this.schedulerService.deleteTask(id);
    }
}
