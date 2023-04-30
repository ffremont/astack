package com.github.ffremont.astack.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DataEntry(String datasetid, Fields fields) {
    public record Fields(
            @JsonProperty("const")
            String constellation,
            String name,
            @JsonProperty("m")
            String messierName,
            String catalog,

            String type,
            @JsonProperty("v_mag")
            String magnitude){}
}
