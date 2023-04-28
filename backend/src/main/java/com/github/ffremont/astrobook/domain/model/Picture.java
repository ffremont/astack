package com.github.ffremont.astrobook.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Picture {
    String id;
    String observationId;
    PictureState state;

    Object moonPhase;
    Weather weather;
    String instrument;
    String location;
    String camera;
    String corrRed;
    Float exposure;
    Integer gain;

    Integer stackCnt;
    List<String> tags;
    String constellation;
    String hash;
    String novaAstrometryReportUrl;
    Float ra;
    Float dec;
}
