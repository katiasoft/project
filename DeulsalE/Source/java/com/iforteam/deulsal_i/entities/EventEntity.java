package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class EventEntity {
    private int index;
    private int userIndex;
    private int campsiteIndex;
    private String campsiteName;
    private String title;
    private String content;
    private int view;
    private Date startDay;
    private Date endDay;
    private Date createdAt;
    private boolean isDeleted;
    private int goodView;
    private String clientIp;
    private String clientUa;
    private String src;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventEntity that = (EventEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public EventEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getUserIndex() {
        return userIndex;
    }

    public EventEntity setUserIndex(int userIndex) {
        this.userIndex = userIndex;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public EventEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public String getCampsiteName() {
        return campsiteName;
    }

    public EventEntity setCampsiteName(String campsiteName) {
        this.campsiteName = campsiteName;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public EventEntity setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getContent() {
        return content;
    }

    public EventEntity setContent(String content) {
        this.content = content;
        return this;
    }

    public int getView() {
        return view;
    }

    public EventEntity setView(int view) {
        this.view = view;
        return this;
    }

    public Date getStartDay() {
        return startDay;
    }

    public EventEntity setStartDay(Date startDay) {
        this.startDay = startDay;
        return this;
    }

    public Date getEndDay() {
        return endDay;
    }

    public EventEntity setEndDay(Date endDay) {
        this.endDay = endDay;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public EventEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public EventEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public int getGoodView() {
        return goodView;
    }

    public EventEntity setGoodView(int goodView) {
        this.goodView = goodView;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public EventEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public EventEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public String getSrc() {
        return src;
    }

    public EventEntity setSrc(String src) {
        this.src = src;
        return this;
    }
}
