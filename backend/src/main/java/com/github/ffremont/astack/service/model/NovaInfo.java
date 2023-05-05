package com.github.ffremont.astack.service.model;

import java.util.List;

public record NovaInfo(List<String> tags, String status, NovaCalibration calibration) {
}
