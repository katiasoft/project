package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class ReservationCampsiteEntity {
    private int index;
    private int userIndex;
    private int campsiteIndex;
    private String userContact;
    private String userId;
    private String userName;
    private String site;
    private Date startDay;
    private Date endDay;
    private int cost;
    private int person;
    private int status;
    private Date createdAt;

    //campsite
    private String campsiteName;
    private String campsiteContact;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReservationCampsiteEntity that = (ReservationCampsiteEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public ReservationCampsiteEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getUserIndex() {
        return userIndex;
    }

    public ReservationCampsiteEntity setUserIndex(int userIndex) {
        this.userIndex = userIndex;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public ReservationCampsiteEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public String getUserContact() {
        return userContact;
    }

    public ReservationCampsiteEntity setUserContact(String userContact) {
        this.userContact = userContact;
        return this;
    }

    public String getUserId() {
        return userId;
    }

    public ReservationCampsiteEntity setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public String getUserName() {
        return userName;
    }

    public ReservationCampsiteEntity setUserName(String userName) {
        this.userName = userName;
        return this;
    }

    public String getSite() {
        return site;
    }

    public ReservationCampsiteEntity setSite(String site) {
        this.site = site;
        return this;
    }

    public Date getStartDay() {
        return startDay;
    }

    public ReservationCampsiteEntity setStartDay(Date startDay) {
        this.startDay = startDay;
        return this;
    }

    public Date getEndDay() {
        return endDay;
    }

    public ReservationCampsiteEntity setEndDay(Date endDay) {
        this.endDay = endDay;
        return this;
    }

    public int getCost() {
        return cost;
    }

    public ReservationCampsiteEntity setCost(int cost) {
        this.cost = cost;
        return this;
    }

    public int getPerson() {
        return person;
    }

    public ReservationCampsiteEntity setPerson(int person) {
        this.person = person;
        return this;
    }

    public int getStatus() {
        return status;
    }

    public ReservationCampsiteEntity setStatus(int status) {
        this.status = status;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public ReservationCampsiteEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public String getCampsiteName() {
        return campsiteName;
    }

    public ReservationCampsiteEntity setCampsiteName(String campsiteName) {
        this.campsiteName = campsiteName;
        return this;
    }

    public String getCampsiteContact() {
        return campsiteContact;
    }

    public ReservationCampsiteEntity setCampsiteContact(String campsiteContact) {
        this.campsiteContact = campsiteContact;
        return this;
    }
}
