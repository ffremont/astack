package com.github.ffremont.astack.web;

import com.github.ffremont.astack.dao.AstrometryDAO;
import com.github.ffremont.astack.domain.ObservationService;
import com.github.ffremont.astack.web.model.Observation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/observation")
@AllArgsConstructor
public class ObservationController {

    private final ObservationService observationService;

    private final AstrometryDAO astrometryDAO;

    @PostMapping()
    public Observation newObservation(@RequestBody Observation newObservation) {
        return observationService.importObservation(newObservation);
    }


}
