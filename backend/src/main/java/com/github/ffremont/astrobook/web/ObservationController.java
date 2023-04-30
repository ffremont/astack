package com.github.ffremont.astrobook.web;

import com.github.ffremont.astrobook.dao.AstrometryDAO;
import com.github.ffremont.astrobook.domain.MoonService;
import com.github.ffremont.astrobook.domain.NgcIcMessierCatalogService;
import com.github.ffremont.astrobook.domain.ObservationService;
import com.github.ffremont.astrobook.domain.model.MoonPhase;
import com.github.ffremont.astrobook.web.model.Observation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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
