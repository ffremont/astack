package com.github.ffremont.astack;

import nom.tam.fits.Fits;
import nom.tam.fits.FitsException;
import nom.tam.fits.ImageData;
import nom.tam.fits.ImageHDU;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.awt.image.LookupOp;
import java.awt.image.ShortLookupTable;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;

@SpringBootApplication
@EnableAsync
public class AstackApplication {
	public final static String DATA_DIR = "astack";

	public final static Path WORKDIR;

	static {
		WORKDIR = Paths.get(Optional.ofNullable(System.getProperty("user.home")).orElse("."));
	}

	public static void main(String[] args) throws IOException, FitsException {
		SpringApplication.run(AstackApplication.class, args);
		//var hdu = (new Fits(Paths.get("test.fit").toFile())).readHDU();

		//Fits fits = new Fits(Paths.get("test.fit").toFile());

		// Scans the FITS, but defers loading data until we need it

		//ImageData data = ((ImageHDU) Arrays.stream(fits.read()).findFirst()).getData();
		//ImageHDU t = (ImageHDU) (Arrays.stream(fits.read()).findFirst()).orElse(null);
		//System.out.println(t.getData().getTiler());

		//var r = create((short[][]) t.getData().getTiler().getCompleteImage());
		//System.out.println(r);
	}

	private static BufferedImage create(short[][] array) {
		var image = new BufferedImage(array.length, array[0].length, BufferedImage.TYPE_BYTE_GRAY);
		for (var row = 0; row < array.length; row++) {
			for (var col = 0; col < array[row].length; col++) {
				image.setRGB(col, row, array[row][col]);
			}
		}
		return image;
	}

}
