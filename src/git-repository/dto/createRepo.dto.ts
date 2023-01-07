import { IsBoolean, IsString } from "class-validator";

export class CreateRepoDto {

    @IsString()
    readonly repositoryName: string;

    @IsBoolean()
    readonly privacy: boolean;

    @IsString()
    readonly description: string;

    @IsString()
    readonly path: string;
}