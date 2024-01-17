package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class EventFileEntity {
    private int index;
    private int eventIndex;
    private String fileName;
    private double fileSize;
    private String fileContentType;
    private byte[] fileData;
    private String clientIp;
    private String clientUa;
    private Date createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventFileEntity that = (EventFileEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public EventFileEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getEventIndex() {
        return eventIndex;
    }

    public EventFileEntity setEventIndex(int eventIndex) {
        this.eventIndex = eventIndex;
        return this;
    }

    public String getFileName() {
        return fileName;
    }

    public EventFileEntity setFileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public double getFileSize() {
        return fileSize;
    }

    public EventFileEntity setFileSize(double fileSize) {
        this.fileSize = fileSize;
        return this;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public EventFileEntity setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
        return this;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public EventFileEntity setFileData(byte[] fileData) {
        this.fileData = fileData;
        return this;
    }

    public String getClientIp() {
        return clientIp;
    }

    public EventFileEntity setClientIp(String clientIp) {
        this.clientIp = clientIp;
        return this;
    }

    public String getClientUa() {
        return clientUa;
    }

    public EventFileEntity setClientUa(String clientUa) {
        this.clientUa = clientUa;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public EventFileEntity setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
