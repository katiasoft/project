package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class EventImageEntity {
    private int index;
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
        EventImageEntity that = (EventImageEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public EventImageEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getName() {
        return name;
    }

    public EventImageEntity setName(String name) {
        this.name = name;
        return this;
    }

    public int getSize() {
        return size;
    }

    public EventImageEntity setSize(int size) {
        this.size = size;
        return this;
    }

    public String getContentType() {
        return contentType;
    }

    public EventImageEntity setContentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    public byte[] getData() {
        return data;
    }

    public EventImageEntity setData(byte[] data) {
        this.data = data;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public EventImageEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public EventImageEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public EventImageEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }
}
