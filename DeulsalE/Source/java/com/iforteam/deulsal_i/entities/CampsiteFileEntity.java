package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class CampsiteFileEntity {
    private int index;
    private int campsiteIndex;
    private String fileName;
    private double fileSize;
    private String fileContentType;
    private byte[] fileData;
    private String clientIp;
    private String clientUa;
    private Date createdAt;

    public int getIndex() {
        return index;
    }

    public CampsiteFileEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public CampsiteFileEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public String getFileName() {
        return fileName;
    }

    public CampsiteFileEntity setFileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public double getFileSize() {
        return fileSize;
    }

    public CampsiteFileEntity setFileSize(double fileSize) {
        this.fileSize = fileSize;
        return this;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public CampsiteFileEntity setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
        return this;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public CampsiteFileEntity setFileData(byte[] fileData) {
        this.fileData = fileData;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public CampsiteFileEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public CampsiteFileEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public CampsiteFileEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CampsiteFileEntity that = (CampsiteFileEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
