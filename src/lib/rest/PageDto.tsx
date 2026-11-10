export class PageDto<T> {
    content: T[];
    offset: number;
    total: number;


    constructor(content: T[], offset: number, total: number) {
        this.content = content;
        this.offset = offset;
        this.total = total;
    }
}