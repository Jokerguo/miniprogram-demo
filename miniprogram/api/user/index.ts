import request from "../../tools/request";

export const test1 = (data: any) => {
    return request({ url: "/test", data, options: { baseUrl: "click" } });
};
