export class ApiResponse{
    status: string;
    statusCode: number;
    massage: string | null;

    constructor(status: string, statusCode: number, massage: string | null = null){
        this.status = status;
        this.massage = massage;
        this.statusCode = statusCode;
    }
    
}