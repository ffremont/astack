package com.github.ffremont.astack.utils;

import com.github.ffremont.astack.domain.model.FitData;
import nom.tam.fits.BasicHDU;
import nom.tam.fits.Fits;
import nom.tam.fits.FitsException;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;

public class FitUtils {
    private FitUtils(){}

    public static FitData analyze(Path fitFile){
        BasicHDU<?> hdu = null;
        try {
            hdu = (new Fits(fitFile.toAbsolutePath().toFile())).readHDU();

            return FitData.builder()
                    .path(fitFile)
                    .gain(Integer.valueOf(hdu.getHeader().findCard("GAIN").getValue()))
                    .stackCnt(Integer.valueOf(hdu.getHeader().findCard("STACKCNT").getValue()))
                    .dateObs(LocalDateTime.parse(hdu.getHeader().findCard("DATE-OBS").getValue()))
                    .instrume(hdu.getHeader().findCard("INSTRUME").getValue())
                    .exposure(Float.parseFloat(hdu.getHeader().findCard("EXPOSURE").getValue()))
                    .temp(Float.parseFloat(hdu.getHeader().findCard("CCD-TEMP").getValue()))
                    .build();
        } catch (FitsException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
