export class NetworkUrls{
    public static BASE_URL:string='http://localhost/xibay/public_html/';

    public static test:string='/test-db';

    //user APIs
    public static LOGIN:string='login';
    public static REGISTER_USER:string='create-user';
    public static SEND_REQUEST:string='send-request';
    public static CHECK_PHN_EXISTS:string='check-phone-number-exists';
    public static CHECK_USER_WITH_PHN_AND_USERNAME:string='check-user-with-phone-and-username';
    public static UPDATE_USER_DETAILS:string='update-user-details';
    public static CHANGE_PASSWORD:string='change-password';
    public static UPDATE_FCM:string='update-fcm-token';
    public static GET_USER_DATA:string='get-user-data';
    public static UPLOAD_PROFILE_PIC:string='upload-profile-picture';
    public static REPORT_PRODUCT:string='report-a-product';

    public static FETCH_MAIN_CONTENT:string='fetch-main-content';
    public static FETCH_USEFUL_MAIN_CONTENT:string='fetch-useful-main-content';
    public static FETCH_PARTICULAR_PRODUCT:string='fetch-particular-product';
    public static SEARCH_A_PRODUCT:string='search-a-product';
    public static POST_A_PRODUCT:string='upload-file-with-data';

    public static FETCH_MY_POSTED_PRODUCTS:string='fetch-my-posted-products';
    public static DELETE_MY_POSTED_PRODUCT:string='delete-a-posted-product';

    public static FETCH_ACCEPTED_USER_DETAILS:string='fetch-request-accepted-user-details';

    public static FETCH_MY_REQUESTS:string='fetch-requested-products';

    public static FETCH_TERMS_AND_POLICIES:string='terms-and-policies';
    public static FETCH_FAQ_FILE:string='faq-file';

    public static FETCH_REQUESTS_FOR_A_PRODUCT:string='fetch-requests-for-a-product';
    public static FEECT_CHOOSEN_USER:string='fetch-choosen-user-for-a-product';
    public static ACCEPT_A_REQUEST:string='accept-request';
}