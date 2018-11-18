export interface item{
    title:string,
    description:string,
    category_name:string,
    image_url:string,
    is_hidden:number,
    useful_year:string,
    useful_branch:string,
    total_requests:number,
    posted_on:string,
    sold_on?:string,
    sold_to?:string
}