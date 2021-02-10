export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id: number, us: string, jwt: string, refreshToken: string, refreshTokenExpiresAt: string){
        this.id = id;
        this.identity = us;
        this.token = jwt;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
     }   
    
}