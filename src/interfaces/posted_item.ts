export interface item{
    id:number,
    title:string,
    description:string,
    category?:number,
    category_name:string,
    image_url:string,
    is_hidden:number,
    useful_year:Array<string>,
    useful_branch:Array<string>,
    total_requests:number,
    created:number,
    sold_on?:number,
    sold_to?:string,
    username_fk?:string,
    user_image_url?:string,
    user_branch?:string,
    user_year?:string
    status?:number//only for requests
    requested_on:number//only for requests
}