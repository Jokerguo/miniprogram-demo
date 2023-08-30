interface RequestConfig {
    url: string;
    method?: 'GET' | 'POST';
    data?: any;
    header?: { [key: string]: any };
    options?: Partial<{
        baseUrl?: string;
        // 不统一报错
        noErrorModal?: Boolean;
    }>;
    needToken?: Boolean;
}

// 响应数据
type Response<T> = WechatMiniprogram.RequestSuccessCallbackResult<{
    data: T;
    errorMsg: string | null;
    nowTime: number;
    rcode: number;
    scode: number;
    traceId: string | null;
    object: any;
    status: any;
}>;
