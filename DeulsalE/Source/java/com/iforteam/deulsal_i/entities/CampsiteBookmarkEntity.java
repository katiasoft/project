package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class CampsiteBookmarkEntity {
    private int index;
    private String userId;
    private int campsiteIndex;

    private Date createdAt;

    public int getIndex() {
        return index;
    }

    public CampsiteBookmarkEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public CampsiteBookmarkEntity setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public CampsiteBookmarkEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public CampsiteBookmarkEntity setCreatedAt(Date created_at) {
        this.createdAt = created_at;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CampsiteBookmarkEntity that = (CampsiteBookmarkEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
