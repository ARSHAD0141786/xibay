export interface User{
    username:string,
    token?:string,
    branch:string,
    year:string,
    phone_number?:string,
    name:string,
    gender:string,
    user_image_url:string,
    FCM_token?:string,
    request_id?:number,//only in case of fetching requests
}