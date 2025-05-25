export default interface CommonResponse<T> {
    code: number;
    message: string;
    data: T;
}
export default interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
