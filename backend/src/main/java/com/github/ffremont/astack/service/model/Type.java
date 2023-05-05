package com.github.ffremont.astack.service.model;

import java.util.Arrays;
import java.util.List;

/**
 *
 */
public enum Type {
    GALAXY(List.of("Gxy", "GxyCld")),
    GLOBULAR_CLUSTER(List.of("GC")),
    HII_IONIZED_REGION(List.of("HIIRgn")),
    OPEN_CLUSTER(List.of("OC")),
    PLANETARY_NEBULAR(List.of("PN")),
    NEBULAR(List.of("Neb", "OC+Neb")),
    NOVA_STAR(List.of("SNR")),
    OTHER(List.of("_"))
    ;
    private List<String> code;
    private Type(List<String> code){
        this.code = code;
    }

    public static Type fromCode(String code){
        return Arrays.asList(values()).stream()
                .filter(type -> type.code.contains(code))
                .findFirst().orElse(null);
    }
}
