package com.iforteam.deulsal_i.models;

public class PageModel {
    public final int pageCount;             // 페이지당 표시할 개수
    public final int totalCount;            // 전체 게시클 개수
    public final int requestPage;           // 요청 페이지
    public final int minPage;               // 조회가능한 최소 페이지 번호
    public final int maxPage;               // 조회가능한 최대 페이지 번호
    public final int displayStartPage;     // 표시할 시작 페이지
    public final int displayEndPage;       // 표시할 끝 페이지
    public final int offset;               // DB용 offset
    public int displayMax = 10;

    public PageModel(int pageCount, int totalCount, int requestPage) {
        this.pageCount = pageCount;
        this.totalCount = totalCount;
        this.requestPage = Math.max(requestPage, 1);
        this.minPage = 1;
        this.maxPage = Math.max(totalCount / pageCount + (totalCount % pageCount == 0 ? 0 : 1), 1);
        this.displayStartPage = ((requestPage - 1) / displayMax) * displayMax + 1;
        this.displayEndPage = Math.min(((requestPage - 1) / displayMax) * displayMax + displayMax, this.maxPage);
        this.offset = (requestPage - 1) * pageCount;
    }

    public PageModel(int pageCount, int totalCount, int requestPage, int displayMax) {
        this.pageCount = pageCount;
        this.totalCount = totalCount;
        this.requestPage = Math.max(requestPage, 1);
        this.minPage = 1;
        this.displayMax = displayMax;
        this.maxPage = Math.max(totalCount / pageCount + (totalCount % pageCount == 0 ? 0 : 1), 1);
        this.displayStartPage = ((requestPage - 1) / displayMax) * displayMax + 1;
        this.displayEndPage = Math.min(((requestPage - 1) / displayMax) * displayMax + displayMax, this.maxPage);
        this.offset = (requestPage - 1) * pageCount;
    }

}
