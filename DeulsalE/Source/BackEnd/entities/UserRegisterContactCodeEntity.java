package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class UserRegisterContactCodeEntity {
    private int index;
    private String contact;
    private String code;
    private String salt;
    private Date createdAt;
    private Date expiresAt;
    private boolean isExpired;

    public int getIndex() {
        return index;
    }

    public UserRegisterContactCodeEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getContact() {
        return contact;
    }

    public UserRegisterContactCodeEntity setContact(String contact) {
        this.contact = contact;
        return this;
    }

    public String getCode() {
        return code;
    }

    public UserRegisterContactCodeEntity setCode(String code) {
        this.code = code;
        return this;
    }

    public String getSalt() {
        return salt;
    }

    public UserRegisterContactCodeEntity setSalt(String salt) {
        this.salt = salt;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public UserRegisterContactCodeEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public UserRegisterContactCodeEntity setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
        return this;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public UserRegisterContactCodeEntity setExpired(boolean expired) {
        isExpired = expired;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserRegisterContactCodeEntity that = (UserRegisterContactCodeEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }


}
