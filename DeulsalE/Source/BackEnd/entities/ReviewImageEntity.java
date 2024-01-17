package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class ReviewImageEntity {
    private int index;
    private int reviewIndex;
    private String name;
    private int size;
    private String contentType;
    private byte[] data;
    private Date createdAt;
    private String clientIp;
    private String clientUa;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReviewImageEntity that = (ReviewImageEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public ReviewImageEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getReviewIndex() {
        return reviewIndex;
    }

    public ReviewImageEntity setReviewIndex(int reviewIndex) {
        this.reviewIndex = reviewIndex;
        return this;
    }

    public String getName() {
        return name;
    }

    public ReviewImageEntity setName(String name) {
        this.name = name;
        return this;
    }

    public int getSize() {
        return size;
    }

    public ReviewImageEntity setSize(int size) {
        this.size = size;
        return this;
    }

    public String getContentType() {
        return contentType;
    }

    public ReviewImageEntity setContentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    public byte[] getData() {
        return data;
    }

    public ReviewImageEntity setData(byte[] data) {
        this.data = data;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public ReviewImageEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public ReviewImageEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public ReviewImageEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }
}
