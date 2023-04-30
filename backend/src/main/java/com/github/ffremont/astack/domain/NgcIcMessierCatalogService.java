package com.github.ffremont.astack.domain;

import com.github.ffremont.astack.dao.NgcIcMessierCatalogDAO;
import com.github.ffremont.astack.domain.model.CelestObject;
import com.github.ffremont.astack.domain.model.DataEntry;
import com.github.ffremont.astack.domain.model.Type;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NgcIcMessierCatalogService {
    private final NgcIcMessierCatalogDAO ngcIcMessierCatalogDAO;

    /**
     *
     * @param targets
     * @return
     */
    public Optional<CelestObject> findCelestObject(List<String> targets) {
        List<DataEntry> entries = targets.stream()
                .map(t -> ngcIcMessierCatalogDAO.getByName(t.toUpperCase()))
                .filter(d -> d.isPresent())
                .map(Optional::get)
                .toList();
        DataEntry moinsBrillant = null;
        for (DataEntry dataEntry : entries) {
            if (Objects.isNull(moinsBrillant) ||
                    (Objects.nonNull(moinsBrillant.fields().magnitude()) && Objects.nonNull(dataEntry.fields().magnitude()) ?
                            Double.valueOf(moinsBrillant.fields().magnitude()) > Double.valueOf(dataEntry.fields().magnitude())
                            :
                            true
                    )
            ) {
                moinsBrillant = dataEntry;
            }
        }
        return Optional.ofNullable(moinsBrillant).map(dataEntry -> new CelestObject(Type.fromCode(dataEntry.fields().type()), Optional.ofNullable(dataEntry.fields().messierName()).orElse(dataEntry.fields().name())));
    }

    public Optional<String> constellationOf(List<String> targets) {
        // recherche en prio messier
        var targetName = targets.stream().filter(target -> target.startsWith("M"))
                .findFirst().or(
                        () -> targets.stream().findFirst()
                );

        if (targetName.isPresent()) {
            return ngcIcMessierCatalogDAO.getByName(targetName.get()).map(dataEntry -> dataEntry.fields().constellation());
        } else {
            return Optional.empty();
        }
    }
}
