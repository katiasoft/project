package com.iforteam.deulsal_i.entities;

import java.util.Objects;

public class PeripheralFacilityEntity {
    private int index;
    private int campsiteIndex;
    private boolean fishing;
    private boolean trailsOut;
    private boolean seaBath;
    private boolean leisure;
    private boolean valley;
    private boolean river;
    private boolean poll;
    private boolean exTeen;
    private boolean exCountry;
    private boolean amuseKid;

    public int getIndex() {
        return index;
    }

    public PeripheralFacilityEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public PeripheralFacilityEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public boolean isFishing() {
        return fishing;
    }

    public PeripheralFacilityEntity setFishing(boolean fishing) {
        this.fishing = fishing;
        return this;
    }

    public boolean isTrailsOut() {
        return trailsOut;
    }

    public PeripheralFacilityEntity setTrailsOut(boolean trailsOut) {
        this.trailsOut = trailsOut;
        return this;
    }

    public boolean isSeaBath() {
        return seaBath;
    }

    public PeripheralFacilityEntity setSeaBath(boolean seaBath) {
        this.seaBath = seaBath;
        return this;
    }

    public boolean isLeisure() {
        return leisure;
    }

    public PeripheralFacilityEntity setLeisure(boolean leisure) {
        this.leisure = leisure;
        return this;
    }

    public boolean isValley() {
        return valley;
    }

    public PeripheralFacilityEntity setValley(boolean valley) {
        this.valley = valley;
        return this;
    }

    public boolean isRiver() {
        return river;
    }

    public PeripheralFacilityEntity setRiver(boolean river) {
        this.river = river;
        return this;
    }

    public boolean isPoll() {
        return poll;
    }

    public PeripheralFacilityEntity setPoll(boolean poll) {
        this.poll = poll;
        return this;
    }

    public boolean isExTeen() {
        return exTeen;
    }

    public PeripheralFacilityEntity setExTeen(boolean exTeen) {
        this.exTeen = exTeen;
        return this;
    }

    public boolean isExCountry() {
        return exCountry;
    }

    public PeripheralFacilityEntity setExCountry(boolean exCountry) {
        this.exCountry = exCountry;
        return this;
    }

    public boolean isAmuseKid() {
        return amuseKid;
    }

    public PeripheralFacilityEntity setAmuseKid(boolean amuseKid) {
        this.amuseKid = amuseKid;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PeripheralFacilityEntity that = (PeripheralFacilityEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public void printValue(){
        System.out.println("index : " + index);
        System.out.println("campsiteIndex : " + campsiteIndex);
        System.out.println("fishing : " + fishing);
        System.out.println("trailsOut : " + trailsOut);
        System.out.println("seaBath : " + seaBath);
        System.out.println("leisure : " + leisure);
        System.out.println("valley : " + valley);
        System.out.println("river : " + river);
        System.out.println("poll : " + poll);
        System.out.println("exTeen : " + exTeen);
        System.out.println("exCountry : " + exCountry);
        System.out.println("amuseKid : " + amuseKid);
    }
}
