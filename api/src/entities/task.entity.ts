import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("task")
export class TaskEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column ({default: 1})
    userId: number;

    @Column ({default: ""})
    description: string;

    @Column ({default: ""})
    date: string;

    @Column ({default: ""})
    time: string;
    
    @Column ({default: ""})
    status: string;
}



