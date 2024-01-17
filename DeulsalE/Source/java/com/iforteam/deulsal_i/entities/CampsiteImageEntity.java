package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class CampsiteImageEntity {
    private int index;
    private int campsiteIndex;
    private String imgName;
    private double imgSize;
    private String imgContentType;
    private byte[] imgData;
    private String clientIp;
    private String clientUa;
    private Date createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CampsiteImageEntity that = (CampsiteImageEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public CampsiteImageEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public CampsiteImageEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public String getImgName() {
        return imgName;
    }

    public CampsiteImageEntity setImgName(String imgName) {
        this.imgName = imgName;
        return this;
    }

    public double getImgSize() {
        return imgSize;
    }

    public CampsiteImageEntity setImgSize(double imgSize) {
        this.imgSize = imgSize;
        return this;
    }

    public String getImgContentType() {
        return imgContentType;
    }

    public CampsiteImageEntity setImgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
        return this;
    }

    public byte[] getImgData() {
        return imgData;
    }

    public CampsiteImageEntity setImgData(byte[] imgData) {
        this.imgData = imgData;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public CampsiteImageEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public CampsiteImageEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public CampsiteImageEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
