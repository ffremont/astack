package com.github.ffremont.astack.web;

import com.github.ffremont.astack.service.ObservationService;
import com.github.ffremont.astack.web.model.Observation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/observation")
@AllArgsConstructor
public class ObservationController {

    private final ObservationService observationService;

    @PostMapping()
    public Observation newObservation(@RequestBody Observation newObservation) {
        return observationService.importObservation(newObservation);
    }


}
