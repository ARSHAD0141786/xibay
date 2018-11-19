export interface item{
    id:number,
    title:string,
    description:string,
    category_name:string,
    image_url:string,
    is_hidden:number,
    useful_year:Array<string>,
    useful_branch:Array<string>,
    total_requests:number,
    created:number,
    sold_on?:number,
    sold_to?:string
}