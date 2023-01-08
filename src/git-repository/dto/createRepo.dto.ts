import { Transform } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreateRepoDto {

    @IsString()
    readonly repositoryName: string;

    @IsString()
    readonly path: string;

    @Transform((value) => Boolean(value))
    @IsBoolean()
    readonly privacy: boolean;

    @IsString()
    readonly description: string;
}