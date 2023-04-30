package com.github.ffremont.astack.domain.model;

import java.util.Arrays;

/**
 * OCl: Open Cluster
 *     GCl: Globular Cluster
 *     Cl+N: Star cluster + Nebula
 *     G: Galaxy
 *     GPair: Galaxy Pair
 *     GTrpl: Galaxy Triplet
 *     GGroup: Group of galaxies
 *     PN: Planetary Nebula
 *     HII: HII Ionized region
 *     DrkN: Dark Nebula
 *     EmN: Emission Nebula
 *     Neb: Nebula
 *     RfN: Reflection Nebula
 *     SNR: Supernova remnant
 *     Nova: Nova star
 */
public enum Type {
    OPEN_CLUSTER("OCl"),
    GLOBULAR_CLUSTER("GCl"),
    NEBULAR_STAR_CLUSTER("Cl+N"),
    GALAXY("G"),
    GALAXY_PAIR("GPair"),
    GALAXY_TRIPLET("GTrpl"),
    PLANETARY_NEBULAR("PN"),
    HII_IONIZED_REGION("HII"),
    DARK_NEBULAR("DrkN"),
    EMISSION_NEBULA("EmN"),
    NEBULAR("Neb"),
    REFLECTION_NEBULA("RfN"),
    SUPERNOVA_REMNANT("SNR"),
    NOVA_STAR("Nova"),
    OTHER("_")
    ;
    private String code;
    private Type(String code){
        this.code = code;
    }

    public static Type fromCode(String code){
        return Arrays.asList(values()).stream()
                .filter(type -> type.code.equals(code))
                .findFirst().orElse(null);
    }
}
