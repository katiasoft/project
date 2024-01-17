package com.iforteam.deulsal_i.entities;

import java.util.Objects;

public class AdditionalFacilityEntity {
    private int index;
    private int campsiteIndex;
    private boolean elt;
    private boolean boil;
    private boolean wifi;
    private boolean firewood;
    private boolean trailsIn;
    private boolean market;
    private int toilet;
    private int bath;
    private int sink;
    private int extinguish;

    public int getIndex() {
        return index;
    }

    public AdditionalFacilityEntity setIndex(int index) {
        this.index = index;
        return this;
    }

    public int getCampsiteIndex() {
        return campsiteIndex;
    }

    public AdditionalFacilityEntity setCampsiteIndex(int campsiteIndex) {
        this.campsiteIndex = campsiteIndex;
        return this;
    }

    public boolean isElt() {
        return elt;
    }

    public AdditionalFacilityEntity setElt(boolean elt) {
        this.elt = elt;
        return this;
    }

    public boolean isBoil() {
        return boil;
    }

    public AdditionalFacilityEntity setBoil(boolean boil) {
        this.boil = boil;
        return this;
    }

    public boolean isWifi() {
        return wifi;
    }

    public AdditionalFacilityEntity setWifi(boolean wifi) {
        this.wifi = wifi;
        return this;
    }

    public boolean isFirewood() {
        return firewood;
    }

    public AdditionalFacilityEntity setFirewood(boolean firewood) {
        this.firewood = firewood;
        return this;
    }

    public boolean isTrailsIn() {
        return trailsIn;
    }

    public AdditionalFacilityEntity setTrailsIn(boolean trailsIn) {
        this.trailsIn = trailsIn;
        return this;
    }

    public boolean isMarket() {
        return market;
    }

    public AdditionalFacilityEntity setMarket(boolean market) {
        this.market = market;
        return this;
    }

    public int getToilet() {
        return toilet;
    }

    public AdditionalFacilityEntity setToilet(int toilet) {
        this.toilet = toilet;
        return this;
    }

    public int getBath() {
        return bath;
    }

    public AdditionalFacilityEntity setBath(int bath) {
        this.bath = bath;
        return this;
    }

    public int getSink() {
        return sink;
    }

    public AdditionalFacilityEntity setSink(int sink) {
        this.sink = sink;
        return this;
    }

    public int getExtinguish() {
        return extinguish;
    }

    public AdditionalFacilityEntity setExtinguish(int extinguish) {
        this.extinguish = extinguish;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdditionalFacilityEntity that = (AdditionalFacilityEntity) o;
        return index == that.index;
    }

    @Override
    public int hashCode() {
        return Objects.hash(index);
    }

    public void printValue(){
        System.out.println("index : " + index);
        System.out.println("campsiteIndex : " + campsiteIndex);
        System.out.println("elt : " + elt);
        System.out.println("boil : " + boil);
        System.out.println("wifi : " + wifi);
        System.out.println("firewood : " + firewood);
        System.out.println("trailsIn : " + trailsIn);
        System.out.println("market : " + market);
        System.out.println("toilet : " + toilet);
        System.out.println("bath : " + bath);
        System.out.println("sink : " + sink);
        System.out.println("extinguish : " + extinguish);
    }
}
