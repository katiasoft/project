package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class ReviewEntity {
    private int index;
    private int reservationIndex;
    private int campsiteIndex;
    private String userId;
    private String comment;
    private int rating;
    private int goodCnt;
    private Date createdAt;
    private boolean isDeleted;
    private String clientIp;
    private String clientUa;

    public int getIndex() {
        return index;
    }

    public ReviewEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getReservationIndex() {
        return reservationIndex;
    }

    public ReviewEntity setReservationIndex(int reservationIndex) {
        this.reservationIndex = reservationIndex;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public ReviewEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public ReviewEntity setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public String getComment() {
        return comment;
    }

    public ReviewEntity setComment(String comment) {
        this.comment = comment;
        return this;
    }

    public int getRating() {
        return rating;
    }

    public ReviewEntity setRating(int rating) {
        this.rating = rating;
        return this;
    }

    public int getGoodCnt() {
        return goodCnt;
    }

    public ReviewEntity setGoodCnt(int goodCnt) {
        this.goodCnt = goodCnt;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public ReviewEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public ReviewEntity setDeleted(boolean deleted) {
        this.isDeleted = deleted;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public ReviewEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public ReviewEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReviewEntity that = (ReviewEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
