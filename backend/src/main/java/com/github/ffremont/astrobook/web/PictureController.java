package com.github.ffremont.astrobook.web;

import com.github.ffremont.astrobook.dao.PictureDAO;
import jakarta.websocket.server.PathParam;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pictures")
@AllArgsConstructor
public class PictureController {
    private final PictureDAO pictureDAO;

    @DeleteMapping("/{id}")
    public void remove(@PathVariable("id") String id) {
        pictureDAO.remove(id);
    }

    @GetMapping("/images/{id}")
    public ResponseEntity image(@PathVariable("id") String id) {
        return ResponseEntity.status(200).contentType(MediaType.IMAGE_JPEG).body(pictureDAO.getBin(id, PictureDAO.PICTURE_FILENAME));
    }

    @GetMapping("/raws/{id}")
    public ResponseEntity raw(@PathVariable("id") String id) {
        return ResponseEntity.status(200)
                .header("Content-Type", "image/fits").body(pictureDAO.getBin(id, PictureDAO.RAW_FILENAME));
    }

    @GetMapping("/thumbs/{id}")
    public ResponseEntity thumb(@PathVariable("id") String id) {
        return ResponseEntity.status(200)
                .contentType(MediaType.IMAGE_JPEG).body(pictureDAO.getBin(id, PictureDAO.THUMB_FILENAME));
    }

    @GetMapping("/annotated/{id}")
    public ResponseEntity annotated(@PathVariable("id") String id) {
        return ResponseEntity.status(200)
                .contentType(MediaType.IMAGE_JPEG).body(pictureDAO.getBin(id, PictureDAO.ANNOTATED_FILENAME));
    }
}
