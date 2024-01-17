package com.iforteam.deulsal_i.entities;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Objects;

public class UserEntity {
    private int index;
    private String userId;
    private String contact;
    private String email;
    private String password;
    private String name;
    private String nickname;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birth;
    private int status;
    private int authority;
    private Date createdAt;

    public int getIndex() {
        return index;
    }

    public UserEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public UserEntity setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public String getContact() {
        return contact;
    }

    public UserEntity setContact(String contact) {
        this.contact = contact;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public UserEntity setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public UserEntity setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getName() {
        return name;
    }

    public UserEntity setName(String name) {
        this.name = name;
        return this;
    }

    public String getNickname() {
        return nickname;
    }

    public UserEntity setNickname(String nickname) {
        this.nickname = nickname;
        return this;
    }

    public Date getBirth() {
        return birth;
    }

    public UserEntity setBirth(Date birth) {
        this.birth = birth;
        return this;
    }

    public int getStatus() {
        return status;
    }

    public UserEntity setStatus(int status) {
        this.status = status;
        return this;
    }

    public int getAuthority() {
        return authority;
    }

    public UserEntity setAuthority(int authority) {
        this.authority = authority;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public UserEntity setCreatedAt(Date created_at) {
        this.createdAt = created_at;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity that = (UserEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }


}
