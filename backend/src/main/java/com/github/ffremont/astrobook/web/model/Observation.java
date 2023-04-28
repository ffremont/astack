package com.github.ffremont.astrobook.web.model;

import com.github.ffremont.astrobook.domain.model.Weather;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Observation {
    String id;
    String location;
    String targets;
    Weather weather;
    String instrument;
    String corrred;
    String path;
    List<String> fits;
}
