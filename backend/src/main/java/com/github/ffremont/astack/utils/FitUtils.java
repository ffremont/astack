package com.github.ffremont.astack.utils;

import com.github.ffremont.astack.service.model.FitData;
import nom.tam.fits.BasicHDU;
import nom.tam.fits.Fits;
import nom.tam.fits.FitsException;
import nom.tam.fits.HeaderCard;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Optional;

public class FitUtils {
    private FitUtils(){}

    public static FitData analyze(Path fitFile){
        BasicHDU<?> hdu = null;
        try {
            hdu = (new Fits(fitFile.toAbsolutePath().toFile())).readHDU();

            var dateObs = hdu.getHeader().findCard("DATE-OBS").getValue();
            return FitData.builder()
                    .path(fitFile)
                    .gain(Integer.valueOf(Optional.ofNullable(hdu.getHeader().findCard("GAIN")).map(HeaderCard::getValue).orElse("0")))
                    .stackCnt(Integer.valueOf(
                            Optional.ofNullable(hdu.getHeader().findCard("STACKCNT")).map(HeaderCard::getValue).orElse("1"))
                    )
                    .dateObs(dateObs.isEmpty() ? LocalDateTime.now() : LocalDateTime.parse(dateObs))
                    .instrume(hdu.getHeader().findCard("INSTRUME").getValue())
                    .exposure(Float.parseFloat(hdu.getHeader().findCard("EXPOSURE").getValue()))
                    .temp(Float.parseFloat(
                            Optional.ofNullable(hdu.getHeader().findCard("CCD-TEMP")).map(HeaderCard::getValue).orElse("20"))
                    )
                    .build();
        } catch (FitsException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
