export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;

    constructor(id: number, us: string, jwt: string){
        this.id = id;
        this.identity = us;
        this.token = jwt;
    }
}