package com.github.ffremont.astack.service.model;

public enum Weather {
    VERY_GOOD("Excellente"),
    GOOD("Bonne"),
    FAVORABLE("Favorable"),
    BAD("Mauvaise");

    String label;

    Weather(String label){
        this.label = label;
    }

    public String label(){
        return this.label;
    }
}
