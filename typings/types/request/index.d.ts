interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST';
  data?: any;
  header?: { [key: string]: any };
  options?: Partial<{
      baseUrl: string;
  }>;
  needToken?: Boolean;
}

type Response = WechatMiniprogram.RequestSuccessCallbackResult<{
  data: any
  errorMsg: string | null,
  nowTime: number
  rcode: number,
  scode: number,
  traceId: string | null,
}>