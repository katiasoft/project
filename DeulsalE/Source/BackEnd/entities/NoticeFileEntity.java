package com.iforteam.deulsal_i.entities;

import java.util.Date;
import java.util.Objects;

public class NoticeFileEntity {

    private int index;
    private int noticeIndex;
    private String fileName;
    private double fileSize;
    private String fileContentType;
    private byte[] fileData;

    public int getIndex() {
        return index;
    }

    public NoticeFileEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getNoticeIndex() {
        return noticeIndex;
    }

    public NoticeFileEntity setNoticeIndex(int noticeIndex) {
        this.noticeIndex = noticeIndex;
        return this;
    }

    public String getFileName() {
        return fileName;
    }

    public NoticeFileEntity setFileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public double getFileSize() {
        return fileSize;
    }

    public NoticeFileEntity setFileSize(double fileSize) {
        this.fileSize = fileSize;
        return this;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public NoticeFileEntity setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
        return this;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public NoticeFileEntity setFileData(byte[] fileData) {
        this.fileData = fileData;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NoticeFileEntity that = (NoticeFileEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
