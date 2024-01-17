package com.iforteam.deulsal_i.entities;

import java.util.Objects;

public class QnaFileEntity {
    private int index;
    private int qnaIndex;
    private String fileName;
    private double fileSize;
    private String fileContentType;
    private byte[] fileData;

    public int getIndex() {
        return index;
    }

    public QnaFileEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getQnaIndex() {
        return qnaIndex;
    }

    public QnaFileEntity setQnaIndex(int qnaIndex) {
        this.qnaIndex = qnaIndex;
        return this;
    }

    public String getFileName() {
        return fileName;
    }

    public QnaFileEntity setFileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public double getFileSize() {
        return fileSize;
    }

    public QnaFileEntity setFileSize(double fileSize) {
        this.fileSize = fileSize;
        return this;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public QnaFileEntity setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
        return this;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public QnaFileEntity setFileData(byte[] fileData) {
        this.fileData = fileData;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QnaFileEntity that = (QnaFileEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }
}
