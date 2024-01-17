package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class FaqEntity {
    private int index;
    private String subject;
    private String content;
    private Date createdAt;
    private boolean isDeleted;
    private String sort;
    private int view;
    private String clientIp;
    private String clientUa;

    public int getIndex() {
        return index;
    }

    public FaqEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getSubject() {
        return subject;
    }

    public FaqEntity setSubject(String subject) {
        this.subject = subject;
        return this;
    }

    public String getContent() {
        return content;
    }

    public FaqEntity setContent(String content) {
        this.content = content;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public FaqEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public FaqEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public String getSort() {
        return sort;
    }

    public FaqEntity setSort(String sort) {
        this.sort = sort;
        return this;
    }

    public int getView() {
        return view;
    }

    public FaqEntity setView(int view) {
        this.view = view;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public FaqEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public FaqEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FaqEntity faqEntity = (FaqEntity) o;
        return index == faqEntity.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}

