package com.github.ffremont.astack.dao;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ffremont.astack.domain.model.DataEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NgcIcMessierCatalogDAO {

    final static String FILENAME = "ngc-ic-messier-catalog.json";

    private final ObjectMapper json;

    List<DataEntry> data;

    @PostConstruct
    public void init() throws IOException {
       this.data = json.readValue(Thread.currentThread().getContextClassLoader().getResourceAsStream(FILENAME), new TypeReference<List<DataEntry>>(){});
    }

    public Optional<DataEntry> getByName(String name){
        return data.stream().filter(dataEntry -> name.equals(dataEntry.fields().name()) || name.equals(dataEntry.fields().messierName())).findFirst();
    }
}
