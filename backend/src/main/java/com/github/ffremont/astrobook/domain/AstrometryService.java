package com.github.ffremont.astrobook.domain;

import com.github.ffremont.astrobook.dao.AstrometryDAO;
import com.github.ffremont.astrobook.dao.PictureDAO;
import com.github.ffremont.astrobook.domain.model.FitData;
import com.github.ffremont.astrobook.domain.model.NovaSubmission;
import com.github.ffremont.astrobook.web.model.Observation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AstrometryService {

    /**
     * Temps entre chaque appel pour vérifier l'avancement du job
     */
    final int TEMPO_MS = 5000;

    final static String API_KEY;

    static {
        API_KEY = Optional.ofNullable(System.getProperty("nova.astrometry.apikey")).orElse("");
    }

    private final AstrometryDAO astrometryDAO;
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

                while (counter < 20) {
                    log.info("sleeping for {}", pictureId);
                    Thread.sleep(TEMPO_MS);
                    counter++;

                    var subInfo = astrometryDAO.getSubInfo(submissionId);
                    var jobId = Optional.ofNullable(subInfo).map(NovaSubmission::jobs).flatMap(jobs -> jobs.stream().findFirst());
                    if (!jobId.isPresent()) continue;

                    var info = astrometryDAO.info(jobId.get());
                    if (!"success".equals(info.status())) continue;

                    var thumbnail = new ByteArrayOutputStream();
                    Thumbnails.of(jpgPath.toFile())
                            .size(512, 512)
                            .outputFormat("jpg")
                            .toOutputStream(thumbnail);

                    var picture = pictureDAO.getById(pictureId).toBuilder()
                            .ra(info.calibration().ra())
                            .dec(info.calibration().dec())
                            .camera(fit.getInstrume())
                            .instrument(observation.getInstrument())
                            .tags(info.tags())
                            .hash(fit.getHash())
                            .corrRed(observation.getCorrred())
                            .exposure(fit.getExposure())
                            .weather(observation.getWeather())
                            .location(observation.getLocation())
                            .stackCnt(fit.getStackCnt())
                            .novaAstrometryReportUrl("https://nova.astrometry.net/user_images/" + subInfo.user_images().stream().findFirst().orElseThrow())
                            .build();
                    var annotated = astrometryDAO.getAnnotatedImage(jobId.get());

                    pictureDAO.save(picture, Files.readAllBytes(jpgPath), thumbnail.toByteArray(), Files.readAllBytes(fit.getPath()), annotated);
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
