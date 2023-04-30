package com.github.ffremont.astack.domain.model;

import java.util.List;

public record NovaInfo(List<String> tags, String status, NovaCalibration calibration) {
}
