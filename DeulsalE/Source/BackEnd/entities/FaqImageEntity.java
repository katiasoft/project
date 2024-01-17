package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class FaqImageEntity {
    private int index;
    private String imgName;
    private double imgSize;
    private String imgContentType;
    private byte[] imgData;
    private String clientIp;
    private String clientUa;
    private Date createdAt;

    public int getIndex() {
        return index;
    }

    public FaqImageEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public String getImgName() {
        return imgName;
    }

    public FaqImageEntity setImgName(String imgName) {
        this.imgName = imgName;
        return this;
    }

    public double getImgSize() {
        return imgSize;
    }

    public FaqImageEntity setImgSize(double imgSize) {
        this.imgSize = imgSize;
        return this;
    }

    public String getImgContentType() {
        return imgContentType;
    }

    public FaqImageEntity setImgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
        return this;
    }

    public byte[] getImgData() {
        return imgData;
    }

    public FaqImageEntity setImgData(byte[] imgData) {
        this.imgData = imgData;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public FaqImageEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public FaqImageEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public FaqImageEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FaqImageEntity that = (FaqImageEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
