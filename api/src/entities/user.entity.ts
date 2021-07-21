import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("task")
export class TaskEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({default: ""})
    name: string;

    @Column()
    avatar: string;
}



