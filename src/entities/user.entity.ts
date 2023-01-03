import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    githubId: string;

    @Column()
    username: string

    @Column({nullable: true})
    displayName: string;

    @Column({ nullable: true})
    profilePhoto: string;
}