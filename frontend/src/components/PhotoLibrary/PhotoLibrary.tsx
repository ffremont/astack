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
import { weathers } from './weathers'
import { moonPhases } from './moonPhases'
import { pictureTypes } from './pictureTypes'

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
    const [tags, setTags] = useState<string[]>([])
    const [pictures, setPictures] = useState<Picture[]>([
        {
            id: '07294ea3-7164-4ec6-aa31-06b79d53f0b3',
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
        setExpanded(null)
        setSelectedTags(values || [])
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
                                        <Button
                                            key={tag}
                                            href={`https://theskylive.com/sky/deepsky/${tag.toLowerCase()}-object`}
                                            target="_blank"
                                            sx={{ margin: 0.5 }}
                                            variant="contained"
                                            className="app-target"
                                        >
                                            {tag
                                                .replace('NGC', 'NGC ')
                                                .replace('IC', 'IC ')
                                                .replace('M', 'M ')}
                                        </Button>
                                    ))}

                                    <ul>
                                        <li>
                                            <strong>
                                                Exposition : {picture.exposure}s
                                                x {picture.stackCnt}
                                            </strong>
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
