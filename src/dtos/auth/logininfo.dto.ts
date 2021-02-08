export class LoginInfoDto {
    administratorId: number;
    username: string;
    token: string;

    constructor(id: number, us: string, jwt: string){
        this.administratorId = id;
        this.username = us;
        this.token = jwt;
    }
}