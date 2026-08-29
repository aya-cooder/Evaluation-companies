export interface Login
{
  email: string;
  password:string;
}


export interface Register extends Login {
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "companyID": number,
    "password": "string" ,
    "role" : "string"
}
export  interface LoginResponse {
  token(token: any): unknown;
  role: string;
  companyId: number;
}

