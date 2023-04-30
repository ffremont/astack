package com.github.ffremont.astack.domain;

import com.github.ffremont.astack.dao.AstrometryDAO;
import com.github.ffremont.astack.dao.PictureDAO;
import com.github.ffremont.astack.domain.model.CelestObject;
import com.github.ffremont.astack.domain.model.FitData;
import com.github.ffremont.astack.domain.model.PictureState;
import com.github.ffremont.astack.web.model.Observation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AstrometryService {

    /**
     * Temps entre chaque appel pour vérifier l'avancement du job
     */
    final int TEMPO_MS = 10000;

    final static String API_KEY;

    static {
        API_KEY = Optional.ofNullable(System.getenv("NOVA_ASTROMETRY_APIKEY")).orElse("");
    }

    private final AstrometryDAO astrometryDAO;
    private final MoonService moonService;
    private final NgcIcMessierCatalogService ngcIcMessierCatalogService;
    private final PictureDAO pictureDAO;

    @Async
    public void processAndStore(Observation observation, List<FitData> fits) {
        var sessionId = astrometryDAO.createLoginSession(API_KEY);

        for (FitData fit : fits) {
            var counter = 0;
            try {
                var pictureId = fit.getId();
                var jpgPath = fit.getPath().resolveSibling(fit.getPath().getFileName().toString().replace(".fit", ".jpg"));
                var submissionId = astrometryDAO.upload(sessionId, jpgPath);

                while (counter < 60) {
                    log.info("waiting for {}", pictureId);
                    Thread.sleep(TEMPO_MS);
                    counter++;

                    var subInfo = astrometryDAO.getSubInfo(submissionId);
                    var jobs = Optional.ofNullable(subInfo)
                            .map(si -> Optional.ofNullable(si.jobs()).orElse(Collections.emptyList()))
                            .orElse(Collections.emptyList());
                    Optional<Integer> jobId = jobs.size() > 0 ? Optional.ofNullable(jobs.get(0)) : Optional.empty();
                    if (!jobId.isPresent()) continue;

                    var info = astrometryDAO.info(jobId.get());
                    if (!"success".equals(info.status())) continue;

                    var thumbnail = new ByteArrayOutputStream();
                    Thumbnails.of(jpgPath.toFile())
                            .size(512, 512)
                            .outputFormat("jpg")
                            .toOutputStream(thumbnail);

                    var tags = info.tags().stream().map(tag -> tag.replace(" ", "")).toList();
                    var celest = ngcIcMessierCatalogService.findCelestObject(tags);
                    var picture = pictureDAO.getById(pictureId).toBuilder()
                            .ra(info.calibration().ra())
                            .name(celest.map(CelestObject::name).orElse(null))
                            .dec(info.calibration().dec())
                            .camera(fit.getInstrume())
                            .gain(fit.getGain())
                            .instrument(observation.getInstrument())
                            .tags(tags)
                            .hash(fit.getHash())
                            .state(PictureState.DONE)
                            .moonPhase(moonService.phaseOf(fit.getDateObs().toLocalDate()))
                            .dateObs(fit.getDateObs())
                            .corrRed(observation.getCorrred())
                            .constellation(ngcIcMessierCatalogService.constellationOf(tags).orElse(null))
                            .exposure(fit.getExposure())
                            .weather(observation.getWeather())
                            .location(observation.getLocation())
                            .type(celest.map(CelestObject::type).orElse(null))
                            .stackCnt(fit.getStackCnt())
                            .novaAstrometryReportUrl("https://nova.astrometry.net/user_images/" + subInfo.user_images().stream().findFirst().orElseThrow())
                            .build();
                    var annotated = astrometryDAO.getAnnotatedImage(jobId.get());

                    pictureDAO.save(picture, Files.readAllBytes(jpgPath), thumbnail.toByteArray(), Files.readAllBytes(fit.getPath()), annotated);
                    log.info("✅ import of {}", fit.getId());
                    break;
                }
            } catch (Exception e) {
                log.error("Analyze de l'image impossible : " + fit.getPath().toString(), e);
                try {
                    pictureDAO.remove(fit.getId());
                }catch(RuntimeException ee){
                    log.error("Effacement impossible de l'image "+fit.getId(), ee);
                }
            }
        }
    }
}
