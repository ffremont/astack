package com.github.ffremont.astack.service;

import com.github.ffremont.astack.dao.DeepSkyCatalogDAO;
import com.github.ffremont.astack.service.model.CelestObject;
import com.github.ffremont.astack.service.model.DsoEntry;
import com.github.ffremont.astack.service.model.Type;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeepSkyCatalogService {
    private final DeepSkyCatalogDAO deepSkyCatalogDAO;

    /**
     * Retourne l'objet celeste le plus brillant de la liste
     *
     * @param targets
     * @return
     */
    public Optional<CelestObject> findCelestObject(List<String> targets) {
        List<DsoEntry> entries = targets.stream()
                .map(t -> deepSkyCatalogDAO.getDsoByName(t.toUpperCase()))
                .filter(d -> d.isPresent())
                .map(Optional::get)
                .toList();
        DsoEntry moinsBrillant = null;
        for (DsoEntry dataEntry : entries) {
            if (Objects.isNull(moinsBrillant) ||
                    (Objects.nonNull(moinsBrillant.magnitude()) && Objects.nonNull(dataEntry.magnitude()) ?
                            Double.valueOf(moinsBrillant.magnitude()) > Double.valueOf(dataEntry.magnitude())
                            :
                            true
                    )
            ) {
                moinsBrillant = dataEntry;
            }
        }
        return Optional.ofNullable(moinsBrillant).map(dataEntry -> new CelestObject(Type.fromCode(dataEntry.type()),
                Optional.ofNullable(dataEntry.cat1())
                    .map(c -> c + dataEntry.id1())
                        .orElse(dataEntry.cat2() + dataEntry.id2())));
    }

    public Optional<String> constellationOf(List<String> targets) {
        //cat1 c'est M
        // recherche en prio messier
        var targetName = targets.stream().filter(target -> target.startsWith("M"))
                .findFirst().or(
                        () -> targets.stream().findFirst()
                );

        if (targetName.isPresent()) {
            return deepSkyCatalogDAO.getDsoByName(targetName.get()).map(dataEntry -> dataEntry.constellation());
        } else {
            return Optional.empty();
        }
    }
}
