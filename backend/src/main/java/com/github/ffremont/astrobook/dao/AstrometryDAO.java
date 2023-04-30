package com.github.ffremont.astrobook.dao;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ffremont.astrobook.domain.model.NovaInfo;
import com.github.ffremont.astrobook.domain.model.NovaLogin;
import com.github.ffremont.astrobook.domain.model.NovaSubmission;
import com.github.ffremont.astrobook.domain.model.NovaUpload;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;

@Service
@Slf4j
@AllArgsConstructor
public class AstrometryDAO {

    private final RestTemplate restTemplate;

    private final ObjectMapper json;

    /**
     * @param apiKey
     * @return
     */
    public String createLoginSession(String apiKey) {
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<String, String>();
        requestBody.add("request-json", "{\"apikey\": \"" + apiKey + "\"}");

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<String> resp = restTemplate.exchange(
                "http://nova.astrometry.net/api/login",
                HttpMethod.POST,
                new HttpEntity<>(requestBody, headers),
                String.class
        );

        try {
            return json.readValue(resp.getBody(), NovaLogin.class).session();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * @param sessionId
     * @param file
     * @return submission Id
     */
    public Integer upload(String sessionId, Path file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> requestBody
                    = new LinkedMultiValueMap<>();
            requestBody.add("file", new FileSystemResource(file.toFile()));
            requestBody.add("request-json", "{\"publicly_visible\": \"n\", \"allow_modifications\": \"d\", \"session\": \"" + sessionId + "\", \"allow_commercial_use\": \"d\"}");

            ResponseEntity<String> resp = restTemplate.exchange(
                    "http://nova.astrometry.net/api/upload",
                    HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    String.class
            );
            return json.readValue(resp.getBody(), NovaUpload.class).subid();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Récupère l'image annotée
     *
     * @param jobId
     * @return
     */
    public byte[] getAnnotatedImage(Integer jobId) {
        ResponseEntity<byte[]> resp = restTemplate.exchange(
                "https://nova.astrometry.net/annotated_display/" + jobId,
                HttpMethod.GET,
                HttpEntity.EMPTY,
                byte[].class
        );
        return resp.getBody();
    }

    /**
     * Récupère des infos sur la soumission de l'analyse
     *
     * @param submissionId
     * @return
     */
    public NovaSubmission getSubInfo(Integer submissionId) {
        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(
                    "http://nova.astrometry.net/api/submissions/" + submissionId,
                    String.class
            );
            return json.readValue(resp.getBody(), NovaSubmission.class);
        } catch (JsonProcessingException e) {
            log.warn("Réponse invalid",e);
            return new NovaSubmission(Collections.EMPTY_LIST,Collections.EMPTY_LIST,Collections.EMPTY_LIST);
        }
    }

    /**
     * Récupère des infos sur l'aanlyse
     *
     * @param jobId
     * @return
     */
    public NovaInfo info(Integer jobId) {
        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(
                    "http://nova.astrometry.net/api/jobs/" + jobId + "/info/",
                    String.class
            );
            return json.readValue(resp.getBody(), NovaInfo.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
