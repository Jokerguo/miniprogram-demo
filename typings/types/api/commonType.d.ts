interface IPageParams {
    page: number;
    pageSize: number;
    total: number;
}

// 列表数据返回
interface ListResponse<T> {
    limitInfo: string;
    list: T[];
    listSize: number;
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}
interface ILoadStatus {
    isLoading: boolean;
    isEnd: boolean;
    isError: boolean;
    isEmpty: boolean;
}

interface IStartAndEnd {
    startTime: number;
    endTime: number;
}