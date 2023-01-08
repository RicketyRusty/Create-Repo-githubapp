import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'users'})
@Unique(['githubId'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    githubId: string;

    @Column()
    username: string

    @Column({nullable: true, default: ''})
    displayName: string;

    @Column({nullable: true, type: "simple-json", default: 'https://avatars.githubusercontent.com/u/28536201'})
    profilePhoto: {value : string};

    @Column({ nullable: true})
    githubaccessToken: string;

    @Column({nullable: true})
    jwtrefreshToken: string;
}