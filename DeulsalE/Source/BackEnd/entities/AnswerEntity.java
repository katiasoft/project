package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class AnswerEntity {
    private int index;
    private int qnaIndex;
    private String content;
    private Date createdAt;
    private boolean isDeleted;
    private String clientIp;
    private String clientUa;

    public int getIndex() {
        return index;
    }

    public AnswerEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getQnaIndex() {
        return qnaIndex;
    }

    public AnswerEntity setQnaIndex(int qnaIndex) {
        this.qnaIndex = qnaIndex;
        return this;
    }

    public String getContent() {
        return content;
    }

    public AnswerEntity setContent(String content) {
        this.content = content;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public AnswerEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public AnswerEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public AnswerEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public AnswerEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnswerEntity that = (AnswerEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

}
