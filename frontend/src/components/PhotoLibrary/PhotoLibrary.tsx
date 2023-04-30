import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Collapse,
    Grid,
    IconButton,
    IconButtonProps,
    styled,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { SyntheticEvent } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import MmsIcon from '@mui/icons-material/Mms'
import { constellations } from './constellations'
import DeleteIcon from '@mui/icons-material/Delete'

const weathers: any = {
    GOOD: 'bonne',
    VERY_GOOD: 'excellente',
    FAVORABLE: 'favorable',
    BAD: 'mauvaise',
}

const moonPhases: any = {
    NEW_MOON: 'Nouvelle lune',
    WAXING_CRESCENT: 'Premier croissant',
    FIRST_QUARTER: 'Premier quartier',
    WAXING_GIBBOUS: 'Gibbeuse croissante',
    FULL_MOON: 'Pleine lune',
    WANING_GIBBOUS: 'Gibbeuse décroissante',
    LAST_QUARTER: 'Dernier quartier',
    WANING_CRESCENT: 'Dernier croissant',
}

const pictureTypes: any = {
    OPEN_CLUSTER: 'Amas ouvert',
    GLOBULAR_CLUSTER: 'Amas globulaire',
    NEBULAR_STAR_CLUSTER: "Amas d'étoiles + Nébuleuse",
    GALAXY: 'Galaxy',
    GALAXY_PAIR: 'Pair galaxy',
    GALAXY_TRIPLET: 'Triplet galaxy',
    PLANETARY_NEBULAR: 'Nébuleuse Planétaire',
    HII_IONIZED_REGION: 'Nébuleuse HII',
    DARK_NEBULAR: 'Nébuleuse obscure',
    EMISSION_NEBULA: 'Nébuleuse émission',
    NEBULAR: 'Nébuleuse',
    REFLECTION_NEBULA: 'Nébuleuse réflection',
    SUPERNOVA_REMNANT: 'Supernova rémanente',
    NOVA_STAR: 'Etoile Nova',
}

type PhotoLibraryProps = {
    onListChange: (count: number) => void
}

type Picture = Partial<{
    id: string
    moonPhase: string
    weather: string
    instrument: string
    location: string
    type: string
    name: string
    camera: string
    corrRed: string
    tags: string[]
    webTags: string[]
    exposure: number
    gain: number
    dateObs: string
    stackCnt: number
    constellation: string
    novaAstrometryReportUrl: string
}>

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props
    return <IconButton {...other} />
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}))

export const PhotoLibrary = ({ onListChange }: PhotoLibraryProps) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([
        'NGC4736',
        'M94',
        'maison',
        'GOOD',
    ])
    const [pictures, setPictures] = useState<Picture[]>([
        {
            id: 'b7a1f204-4965-4054-99ad-95f97c9194bc',
            name: 'M94',
            moonPhase: 'WANING_CRESCENT',
            dateObs: '2023-04-20T22:01:12.25',
            weather: 'GOOD',
            instrument: 'SW 250/1200',
            location: 'maison',
            camera: 'ZWO ASI294MM Pro',
            corrRed: 'Starizona Nexus 0.75x',
            exposure: 1.0,
            gain: 120,
            stackCnt: 262,
            tags: ['NGC4736', 'M94'],
            constellation: 'CVn',
            type: 'GALAXY',
            webTags: [
                'NGC4736',
                'M94',
                'maison',
                'GOOD',
                'WANING_CRESCENT',
                'CVn',
            ],
        },
        {
            id: '113ff886-290c-4f9e-b689-b5fe78afcf22',
            name: 'M86',
            moonPhase: 'WANING_CRESCENT',
            dateObs: '2023-04-20T21:26:54.79',
            weather: 'GOOD',
            instrument: 'SW 250/1200',
            location: 'maison',
            camera: 'ZWO ASI294MM Pro',
            corrRed: 'Starizona Nexus 0.75x',
            exposure: 1.0,
            gain: 120,
            stackCnt: 19,
            tags: [
                'IC3258',
                'NGC4374',
                'M84',
                'NGC4387',
                'NGC4388',
                'NGC4402',
                'NGC4406',
                'M86',
                'NGC4407',
                'NGC4425',
                'NGC4431',
                'NGC4435',
                'NGC4436',
                'NGC4438',
            ],
            constellation: 'Vir',
            type: 'GALAXY',
            webTags: [
                'IC3258',
                'NGC4374',
                'M84',
                'NGC4387',
                'NGC4388',
                'NGC4402',
                'NGC4406',
                'M86',
                'NGC4407',
                'NGC4425',
                'NGC4431',
                'NGC4435',
                'NGC4436',
                'NGC4438',
                'maison',
                'GOOD',
                'WANING_CRESCENT',
                'Vir',
            ],
        },
    ])

    const refreshPictures = () => {
        fetch('/api/pictures')
            .then((r) => r.json())
            .then((p) => setPictures(p))
    }

    useEffect(() => {
        fetch('/api/pictures/tags')
            .then((r) => r.json())
            .then((t) => setTags(t))

        refreshPictures()
    }, [])

    const [expanded, setExpanded] = useState<string | null>(null)

    const handleExpandClick = (id: string) => {
        if (expanded) {
            setExpanded(null)
        } else {
            setExpanded(id)
        }
    }

    const handleTagChange = (e: SyntheticEvent, values: string[] | null) => {
        setExpanded(null);
        setSelectedTags(values || []);
    }

    const handleDelete = (id: any) => {
        if (!window.confirm(`Confirmez-vous la suppression de ${id} ?`)) {
            return
        }

        fetch(`/api/pictures/${id}`, {
            method: 'DELETE',
        }).then((r) => {
            refreshPictures()

            if (r.status === 200) alert('Suppression avec succès')
            else alert('Oups un problème est survenue lors de la suppression')
        })
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        limitTags={3}
                        options={tags}
                        getOptionLabel={(option) => option}
                        onChange={handleTagChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Tags"
                                placeholder="M54"
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={1}>
                {pictures
                    .filter(
                        (p) =>
                            selectedTags.filter((x) =>
                                (p.webTags || []).includes(x)
                            ).length === selectedTags.length
                    )
                    .map((picture) => (
                        <Grid item xs={6} key={picture.id}>
                            {' '}
                            <Card>
                                <CardHeader
                                    action={
                                        <IconButton
                                            href={`/api/pictures/images/${picture.id}`}
                                            target="_blank"
                                            aria-label="voir"
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    }
                                    title={`${
                                        picture.type
                                            ? pictureTypes[picture.type] + ' : '
                                            : 'Type inconnu '
                                    }${
                                        picture.name
                                            ? picture.name
                                            : 'cible introuvé'
                                    } ${
                                        picture.constellation
                                            ? '(' +
                                              constellations.find(
                                                  (c) =>
                                                      c.abr ===
                                                      picture.constellation
                                              )?.label +
                                              ')'
                                            : ''
                                    }`}
                                    subheader={`${new Intl.DateTimeFormat(
                                        'fr-FR',
                                        {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                            timeZone: 'Europe/Paris',
                                        }
                                    ).format(
                                        new Date(picture.dateObs || new Date())
                                    )} à ${picture.location}`}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={`/api/pictures/thumbs/${picture.id}`}
                                    alt=""
                                />
                                <CardContent>
                                    {picture.tags?.map((tag) => (
                                        <Chip
                                            key={tag}
                                            sx={{ margin: 0.5 }}
                                            className="app-target"
                                            label={tag
                                                .replace('NGC', 'NGC ')
                                                .replace('IC', 'IC ')
                                                .replace('M', 'M ')}
                                            color="primary"
                                        />
                                    ))}

                                    <ul>
                                        <li>
                                            <strong>Exposition : {picture.exposure}s x{' '}
                                            {picture.stackCnt}</strong>
                                        </li>
                                        <li>Camera : {picture.camera}</li>
                                    </ul>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <Button
                                        color={'secondary'}
                                        target="_blank"
                                        href={`/api/pictures/annotated/${picture.id}`}
                                        startIcon={<MmsIcon />}
                                    >
                                        Annotation
                                    </Button>
                                    <Button
                                        download={picture.id + '.fit'}
                                        href={`/api/pictures/raws/${picture.id}`}
                                        startIcon={<DownloadForOfflineIcon />}
                                    >
                                        Source
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(picture.id)}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Effacer
                                    </Button>

                                    <ExpandMore
                                        expand={expanded === picture.id}
                                        onClick={() =>
                                            handleExpandClick(
                                                picture.id as string
                                            )
                                        }
                                        aria-expanded={expanded === picture.id}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                                <Collapse
                                    in={expanded === picture.id}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <CardContent>
                                        <ul>
                                            {picture.constellation && (
                                                <li>
                                                    Constellation :{' '}
                                                    {
                                                        constellations.find(
                                                            (c) =>
                                                                c.abr ===
                                                                picture.constellation
                                                        )?.label
                                                    }
                                                    ({picture.constellation})
                                                </li>
                                            )}
                                            {picture.moonPhase && (
                                                <li>
                                                    {
                                                        moonPhases[
                                                            picture.moonPhase
                                                        ]
                                                    }{' '}
                                                    ({picture.moonPhase})
                                                </li>
                                            )}
                                            <li>{picture.instrument}</li>
                                            <li>{picture.corrRed}</li>
                                            {picture.weather && (
                                                <li>
                                                    Météo :{' '}
                                                    {weathers[picture.weather]}(
                                                    {picture.weather})
                                                </li>
                                            )}
                                            <li>Id: {picture.id}</li>
                                        </ul>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    )
}
