export class NetworkUrls{
    public static BASE_URL:string='http://localhost/xibay/public_html/';

    public static test:string='/test-db';

    //user APIs
    public static LOGIN:string='login';
    public static REGISTER:string='create-user';
    public static SEND_REQUEST:string='send-request';
    public static CHECK_PHN_EXISTS:string='check-phone-number-exists';
    public static CHECK_USER_WITH_PHN_AND_USERNAME:string='check-user-with-phone-and-username';
    public static UPDATE_USER_DETAILS:string='update-user-details';
    public static CHANGE_PASSWORD:string='change-password';
    public static UPDATE_FCM:string='update-fcm-token';
    public static GET_USER_DATA:string='get-user-data';
}