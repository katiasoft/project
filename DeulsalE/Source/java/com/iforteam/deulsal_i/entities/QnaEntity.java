package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class QnaEntity {
    private int index;
    private String userId;
    private String title;
    private String content;
    private Date createdAt;
    private boolean isDeleted;
    private String clientIp;
    private String clientUa;
    private boolean isSort;

    public int getIndex() {
        return index;
    }

    public QnaEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public QnaEntity setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public QnaEntity setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getContent() {
        return content;
    }

    public QnaEntity setContent(String content) {
        this.content = content;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public QnaEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public QnaEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public QnaEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public QnaEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public boolean isSort() {
        return isSort;
    }

    public QnaEntity setSort(boolean sort) {
        isSort = sort;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QnaEntity qnaEntity = (QnaEntity) o;
        return index == qnaEntity.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}

