package com.github.ffremont.astack.dao;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ffremont.astack.service.model.ConstellationData;
import com.github.ffremont.astack.service.model.DsoEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static java.util.function.Predicate.not;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeepSkyCatalogDAO {

    final static String DSO_FILENAME = "deep-sky-objects.json";
    final static String CONSTS_FILENAME = "constellations.json";

    private final ObjectMapper json;

    List<DsoEntry> dsoEntries;
    List<ConstellationData> constellations;

    @PostConstruct
    public void init() throws IOException {
        this.dsoEntries = json.readValue(Thread.currentThread().getContextClassLoader().getResourceAsStream(DSO_FILENAME), new TypeReference<List<DsoEntry>>() {
        });
        this.constellations = json.readValue(Thread.currentThread().getContextClassLoader().getResourceAsStream(CONSTS_FILENAME), new TypeReference<List<ConstellationData>>() {
        });
    }

    public Optional<ConstellationData> getConstellationByAbr(String abr){
        return constellations.stream().filter(c -> c.abr().equals(abr)).findFirst();
    }


    public Optional<DsoEntry> getDsoByName(String name) {
        var id = Integer.valueOf(Optional.ofNullable(name.replaceAll("[\\D.]", "")).filter(not(String::isBlank)).orElse("0").trim());
        var category = Optional.ofNullable(name.replaceAll("[\\d.]", "")).filter(not(String::isBlank)).orElse("").trim();

        return dsoEntries.stream().filter(dsoEntry ->
                (id.equals(dsoEntry.id1()) && category.equals(dsoEntry.cat1()))
                        ||
                        (id.equals(dsoEntry.id2()) && category.equals(dsoEntry.cat2()))
        ).findFirst();
    }
}
