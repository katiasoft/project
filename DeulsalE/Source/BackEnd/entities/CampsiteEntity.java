package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class CampsiteEntity {
    private int index;
    private int userIndex;
    private String name;
    private int business;
    private String numberAd;
    private String roadAd;
    private int generalCnt;
    private int autoCnt;
    private int caravanCnt;
    private int glampingCnt;
    private String contact;
    private String characteristics;
    private String introduction;
    private boolean spring;
    private boolean summer;
    private boolean fall;
    private boolean winter;
    private boolean weekday;
    private boolean weekend;
    private String url;
    private double portalRating;
    private double rating;
    private double star;
    private int portalReviewCnt;
    private int reviewCnt;
    private int bookmarkCnt;
    private Date createdAt;
    private boolean isReservation;
    private String costList;
    private boolean isDeleted;
    private double latitude;
    private double longitude;

    public int getIndex() {
        return index;
    }

    public CampsiteEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getUserIndex() {
        return userIndex;
    }

    public CampsiteEntity setUserIndex(int userIndex) {
        this.userIndex = userIndex;
        return this;
    }

    public String getName() {
        return name;
    }

    public CampsiteEntity setName(String name) {
        this.name = name;
        return this;
    }

    public int getBusiness() {
        return business;
    }

    public CampsiteEntity setBusiness(int business) {
        this.business = business;
        return this;
    }

    public String getNumberAd() {
        return numberAd;
    }

    public CampsiteEntity setNumberAd(String numberAd) {
        this.numberAd = numberAd;
        return this;
    }

    public String getRoadAd() {
        return roadAd;
    }

    public CampsiteEntity setRoadAd(String roadAd) {
        this.roadAd = roadAd;
        return this;
    }

    public int getGeneralCnt() {
        return generalCnt;
    }

    public CampsiteEntity setGeneralCnt(int generalCnt) {
        this.generalCnt = generalCnt;
        return this;
    }

    public int getAutoCnt() {
        return autoCnt;
    }

    public CampsiteEntity setAutoCnt(int autoCnt) {
        this.autoCnt = autoCnt;
        return this;
    }

    public int getCaravanCnt() {
        return caravanCnt;
    }

    public CampsiteEntity setCaravanCnt(int caravanCnt) {
        this.caravanCnt = caravanCnt;
        return this;
    }

    public int getGlampingCnt() {
        return glampingCnt;
    }

    public CampsiteEntity setGlampingCnt(int glampingCnt) {
        this.glampingCnt = glampingCnt;
        return this;
    }

    public String getContact() {
        return contact;
    }

    public CampsiteEntity setContact(String contact) {
        this.contact = contact;
        return this;
    }

    public String getCharacteristics() {
        return characteristics;
    }

    public CampsiteEntity setCharacteristics(String characteristics) {
        this.characteristics = characteristics;
        return this;
    }

    public String getIntroduction() {
        return introduction;
    }

    public CampsiteEntity setIntroduction(String introduction) {
        this.introduction = introduction;
        return this;
    }

    public boolean isSpring() {
        return spring;
    }

    public CampsiteEntity setSpring(boolean spring) {
        this.spring = spring;
        return this;
    }

    public boolean isSummer() {
        return summer;
    }

    public CampsiteEntity setSummer(boolean summer) {
        this.summer = summer;
        return this;
    }

    public boolean isFall() {
        return fall;
    }

    public CampsiteEntity setFall(boolean fall) {
        this.fall = fall;
        return this;
    }

    public boolean isWinter() {
        return winter;
    }

    public CampsiteEntity setWinter(boolean winter) {
        this.winter = winter;
        return this;
    }

    public boolean isWeekday() {
        return weekday;
    }

    public CampsiteEntity setWeekday(boolean weekday) {
        this.weekday = weekday;
        return this;
    }

    public boolean isWeekend() {
        return weekend;
    }

    public CampsiteEntity setWeekend(boolean weekend) {
        this.weekend = weekend;
        return this;
    }

    public String getUrl() {
        return url;
    }

    public CampsiteEntity setUrl(String url) {
        this.url = url;
        return this;
    }

    public double getPortalRating() {
        return portalRating;
    }

    public CampsiteEntity setPortalRating(double portalRating) {
        this.portalRating = portalRating;
        return this;
    }

    public double getRating() {
        return rating;
    }

    public CampsiteEntity setRating(double rating) {
        this.rating = rating;
        return this;
    }

    public double getStar() {
        return star;
    }

    public CampsiteEntity setStar(double star) {
        this.star = star;
        return this;
    }

    public int getPortalReviewCnt() {
        return portalReviewCnt;
    }

    public CampsiteEntity setPortalReviewCnt(int portalReviewCnt) {
        this.portalReviewCnt = portalReviewCnt;
        return this;
    }

    public int getReviewCnt() {
        return reviewCnt;
    }

    public CampsiteEntity setReviewCnt(int reviewCnt) {
        this.reviewCnt = reviewCnt;
        return this;
    }

    public int getBookmarkCnt() {
        return bookmarkCnt;
    }

    public CampsiteEntity setBookmarkCnt(int bookmarkCnt) {
        this.bookmarkCnt = bookmarkCnt;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public CampsiteEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public boolean isReservation() {
        return isReservation;
    }

    public CampsiteEntity setReservation(boolean reservation) {
        isReservation = reservation;
        return this;
    }

    public String getCostList() {
        return costList;
    }

    public CampsiteEntity setCostList(String costList) {
        this.costList = costList;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public CampsiteEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public double getLatitude() {
        return latitude;
    }

    public CampsiteEntity setLatitude(double latitude) {
        this.latitude = latitude;
        return this;
    }

    public double getLongitude() {
        return longitude;
    }

    public CampsiteEntity setLongitude(double longitude) {
        this.longitude = longitude;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CampsiteEntity that = (CampsiteEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public void printValue(){
        System.out.println("index : " + index);
        System.out.println("userIndex : " + userIndex);
        System.out.println("name : " + name);
        System.out.println("business : " + business);
        System.out.println("numberAd : " + numberAd);
        System.out.println("roadAd : " + roadAd);
        System.out.println("generalCnt : " + generalCnt);
        System.out.println("autoCnt : " + autoCnt);
        System.out.println("caravanCnt : " + caravanCnt);
        System.out.println("glampingCnt : " + glampingCnt);
        System.out.println("contact : " + contact);
        System.out.println("characteristics : " + characteristics);
        System.out.println("introduction : " + introduction);
        System.out.println("spring : " + spring);
        System.out.println("summer : " + summer);
        System.out.println("fall : " + fall);
        System.out.println("winter : " + winter);
        System.out.println("weekday : " + weekday);
        System.out.println("weekend : " + weekend);
        System.out.println("url : " + url);
        System.out.println("portalRating : " + portalRating);
        System.out.println("rating : " + rating);
        System.out.println("portalReviewCnt : " + portalReviewCnt);
        System.out.println("reviewCnt : " + reviewCnt);
        System.out.println("bookmarkCnt : " + bookmarkCnt);
        System.out.println("createdAt : " + createdAt);
        System.out.println("isReservation : " + isReservation);
        System.out.println("costList : " + costList);
        System.out.println("isDeleted : " + isDeleted);
        System.out.println("latitude : " + latitude);
        System.out.println("longitude : " + longitude);
    }
}
