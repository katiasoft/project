package com.iforteam.deulsal_i.entities;

import java.util.Objects;

public class GrampingFacilityEntity {
    private int index;
    private int campsiteIndex;
    private boolean bed;
    private boolean television;
    private boolean refrigerator;
    private boolean internet;

    // 수정 등록시 중복되어 수정
    private boolean grampingToilet;
    private boolean airConditioner;
    private boolean heater;
    private boolean utensil;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GrampingFacilityEntity that = (GrampingFacilityEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public int getIndex() {
        return index;
    }

    public GrampingFacilityEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public GrampingFacilityEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public boolean isBed() {
        return bed;
    }

    public GrampingFacilityEntity setBed(boolean bed) {
        this.bed = bed;
        return this;
    }

    public boolean isTelevision() {
        return television;
    }

    public GrampingFacilityEntity setTelevision(boolean television) {
        this.television = television;
        return this;
    }

    public boolean isRefrigerator() {
        return refrigerator;
    }

    public GrampingFacilityEntity setRefrigerator(boolean refrigerator) {
        this.refrigerator = refrigerator;
        return this;
    }

    public boolean isInternet() {
        return internet;
    }

    public GrampingFacilityEntity setInternet(boolean internet) {
        this.internet = internet;
        return this;
    }

    public boolean isGrampingToilet() {
        return grampingToilet;
    }

    public GrampingFacilityEntity setGrampingToilet(boolean grampingToilet) {
        this.grampingToilet = grampingToilet;
        return this;
    }

    public boolean isAirConditioner() {
        return airConditioner;
    }

    public GrampingFacilityEntity setAirConditioner(boolean airConditioner) {
        this.airConditioner = airConditioner;
        return this;
    }

    public boolean isHeater() {
        return heater;
    }

    public GrampingFacilityEntity setHeater(boolean heater) {
        this.heater = heater;
        return this;
    }

    public boolean isUtensil() {
        return utensil;
    }

    public GrampingFacilityEntity setUtensil(boolean utensil) {
        this.utensil = utensil;
        return this;
    }

    public void printValue(){
        System.out.println("index : " + index);
        System.out.println("campsiteIndex : " + campsiteIndex);
        System.out.println("bed : " + bed);
        System.out.println("television : " + television);
        System.out.println("refrigerator : " + refrigerator);
        System.out.println("internet : " + internet);
        System.out.println("grampingToilet : " + grampingToilet);
        System.out.println("airConditioner : " + airConditioner);
        System.out.println("heater : " + heater);
        System.out.println("utensil : " + utensil);
    }
}
