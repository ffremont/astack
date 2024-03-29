package com.github.ffremont.astack.dao;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ffremont.astack.AstackApplication;
import com.github.ffremont.astack.service.model.Picture;
import com.github.ffremont.astack.service.model.PictureState;
import com.github.ffremont.astack.web.model.Observation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static java.util.Optional.of;
import static java.util.function.Predicate.isEqual;
import static java.util.function.Predicate.not;

@Service
@RequiredArgsConstructor
public class PictureDAO {

    public final static String THUMB_FILENAME = "thumb.jpg";
    public final static String RAW_FILENAME = "raw.fit";
    public final static String PICTURE_FILENAME = "picture.jpg";
    public final static String DATA_FILENAME = "data.json";
    public  final static String ANNOTATED_FILENAME = "annotated.jpg";

    final static Function<String, Path> PICTURE_DIR =(pictureId) -> AstackApplication.WORKDIR.resolve(AstackApplication.DATA_DIR).resolve(pictureId);

    private final ObjectMapper json;


    private final static ConcurrentHashMap<String, Picture> DATASTORE = new ConcurrentHashMap<>();

    @PostConstruct
    public void load() {
        try {
            var dataDir = AstackApplication.WORKDIR.resolve(AstackApplication.DATA_DIR);
            if (!dataDir.toFile().exists()) Files.createDirectories(dataDir);

            Files.list(dataDir)
                    .filter(dir -> !dir.getFileName().toString().startsWith("."))
                    .forEach(pictureDir -> {
                        var id = pictureDir.getFileName().toString();
                        try {
                            DATASTORE.put(id, json.readValue(Files.readAllBytes(pictureDir.resolve(DATA_FILENAME)), Picture.class));
                        } catch (IOException e) {
                            throw new RuntimeException("Filename invalid : "+id,e);
                        }
                    });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param hashOfRaw
     * @return
     */
    public boolean has(String hashOfRaw) {
        return DATASTORE.entrySet().stream().anyMatch(stringPictureEntry -> hashOfRaw.equals(stringPictureEntry.getValue().getHash()));
    }

    /**
     * @param ids
     * @param obs
     */
    public void allocate(List<String> ids, Observation obs) {
        for (String id : ids) {
            DATASTORE.put(id, Picture.builder().id(id)
                    .weather(obs.getWeather())
                    .instrument(obs.getInstrument())
                    .corrRed(obs.getCorrred())
                    .observationId(obs.getId())
                    .state(PictureState.PENDING).build());
        }
    }

    /**
     * @param id
     * @return
     */
    public Picture getById(String id) {
        return DATASTORE.get(id);
    }

    /**
     *
     * @param pictureId
     * @return
     */
    public byte[] getBin(String pictureId, String filename){
        try {
            return Files.readAllBytes(PICTURE_DIR.apply(pictureId).resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param picture
     * @param thumb
     * @param raw
     * @param annotated
     */
    public void save(Picture picture, byte[] jpg, byte[] thumb, byte[] raw, byte[] annotated) {
        final var pictureDir = PICTURE_DIR.apply(picture.getId());

        try {
            Files.createDirectories(pictureDir);
            Files.write(pictureDir.resolve(pictureDir.resolve(THUMB_FILENAME)), thumb, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            Files.write(pictureDir.resolve(pictureDir.resolve(ANNOTATED_FILENAME)), annotated, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            Files.write(pictureDir.resolve(pictureDir.resolve(PICTURE_FILENAME)), jpg, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            Files.write(pictureDir.resolve(pictureDir.resolve(RAW_FILENAME)), raw, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            Files.write(pictureDir.resolve(pictureDir.resolve(DATA_FILENAME)), json.writer().writeValueAsBytes(picture), StandardOpenOption.CREATE, StandardOpenOption.WRITE);

            DATASTORE.put(picture.getId(), picture);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void refresh(Picture picture){
        final var pictureDir = PICTURE_DIR.apply(picture.getId());
        try {
            Files.deleteIfExists(pictureDir.resolve(pictureDir.resolve(DATA_FILENAME)));
            Files.write(pictureDir.resolve(pictureDir.resolve(DATA_FILENAME)), json.writer().writeValueAsBytes(picture), StandardOpenOption.CREATE);

            DATASTORE.put(picture.getId(), picture);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param pictureId
     */
    public void remove(String pictureId) {
        final var pictureDir = PICTURE_DIR.apply(pictureId);
        try {
            if (DATASTORE.containsKey(pictureId)) {
                DATASTORE.remove(pictureId);
                FileSystemUtils.deleteRecursively(pictureDir);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Stream<Picture> getAll(){
        return DATASTORE.entrySet().stream().map(Map.Entry::getValue);
    }


}
