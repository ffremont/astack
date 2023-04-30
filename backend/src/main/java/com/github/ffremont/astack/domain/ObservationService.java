package com.github.ffremont.astack.domain;

import com.github.ffremont.astack.dao.PictureDAO;
import com.github.ffremont.astack.domain.model.FitData;
import com.github.ffremont.astack.utils.FitUtils;
import com.github.ffremont.astack.web.model.Observation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Optional;
import java.util.UUID;

import static org.apache.commons.codec.digest.MessageDigestAlgorithms.SHA_224;


@Service
@RequiredArgsConstructor
public class ObservationService {

    private final AstrometryService astrometryService;

    private final PictureDAO pictureDAO;


    public Observation importObservation(Observation observation){
        final var obsId = UUID.randomUUID().toString();

        var fits = Arrays.asList(observation.getTargets().toLowerCase().split(","))
                .stream().map(target ->{
                    try {
                        var newTarget = target.trim();
                        return Files.list(Paths.get(observation.getPath()))
                                .filter(file -> file.getFileName().toString().endsWith(".fit"))
                                .filter(fileName -> {
                                    return fileName.getFileName().toString().toLowerCase().contains(newTarget);

                                })
                                .map(FitUtils::analyze)
                                .map(fit -> {
                                    try {
                                        return fit.toBuilder()
                                                .id(UUID.randomUUID().toString())
                                                .hash(new DigestUtils(SHA_224).digestAsHex(fit.getPath().toFile())).build();
                                    } catch (IOException e) {
                                        throw new RuntimeException(e);
                                    }
                                })
                                .filter(fit -> !pictureDAO.has(fit.getHash()))
                                .max(Comparator.comparing(FitData::getStackCnt));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }).filter(Optional::isPresent).map(Optional::get).toList();

        var newObs = observation.toBuilder().id(obsId).fits(fits.stream().map(FitData::getId).toList()).build();

        // persist ids
        pictureDAO.allocate(fits.stream().map(f -> f.getId()).toList(), newObs);

        //background
        astrometryService.processAndStore(observation, fits);

        return newObs;
    }
}
