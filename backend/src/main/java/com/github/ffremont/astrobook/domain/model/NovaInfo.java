package com.github.ffremont.astrobook.domain.model;

import java.util.List;

public record NovaInfo(List<String> tags, String status, NovaCalibration calibration) {
}
